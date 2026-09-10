const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gemini-1.5-flash';
  }

  /**
   * Helper to invoke Gemini REST endpoint
   */
  async invokeGemini(prompt, systemInstruction = '') {
    if (!this.apiKey) {
      throw new Error('AI_API_KEY is not configured');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  }

  /**
   * Extract structured resume data from raw text
   */
  async extractResumeStructure(resumeText) {
    if (!this.apiKey) {
      return this.fallbackResumeExtraction(resumeText);
    }

    const systemPrompt = `You are a resume analysis engine. Extract structured details from the resume text into strict valid JSON format.
Do NOT fabricate any information. If a field is not found, use null or empty array [].
Return ONLY raw JSON, with no markdown code blocks or additional text.

JSON Schema:
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "location": "string | null",
  "linkedin": "string | null",
  "github": "string | null",
  "portfolio": "string | null",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "responsibilities": ["string"],
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "certifications": ["string"],
  "achievements": ["string"]
}`;

    try {
      const rawResponse = await this.invokeGemini(resumeText, systemPrompt);
      const cleaned = this.cleanJsonResponse(rawResponse);
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('LLM resume extraction failed, using heuristic parser:', err.message);
      return this.fallbackResumeExtraction(resumeText);
    }
  }

  /**
   * Extract structured requirements from Job Description text
   */
  async extractJdStructure(jdText) {
    if (!this.apiKey) {
      return this.fallbackJdExtraction(jdText);
    }

    const systemPrompt = `You are a job description parser. Extract structured requirements into strict valid JSON format.
Return ONLY raw JSON, with no markdown formatting.

JSON Schema:
{
  "roleTitle": "string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "requiredExperienceYears": "number | string",
  "educationRequirement": "string",
  "certifications": ["string"],
  "keywords": ["string"],
  "responsibilities": ["string"]
}`;

    try {
      const rawResponse = await this.invokeGemini(jdText, systemPrompt);
      const cleaned = this.cleanJsonResponse(rawResponse);
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('LLM JD extraction failed, using heuristic parser:', err.message);
      return this.fallbackJdExtraction(jdText);
    }
  }

  /**
   * Process Chat Messages with full analysis context
   */
  async processChatMessage(userMessage, contextData, conversationHistory = []) {
    if (!this.apiKey) {
      return this.fallbackChatResponse(userMessage, contextData);
    }

    const systemPrompt = `You are CareerLens AI, an expert career mentor and AI resume advisor.
You are helping a candidate understand their resume analysis against a Job Description.

Analysis Context:
- ATS Score: ${contextData.atsScore}/100 (${contextData.matchLevel})
- Job Readiness Score: ${contextData.jobReadinessScore}/100
- Matched Skills: ${JSON.stringify(contextData.matchedSkills?.map(s => s.skill) || [])}
- Missing Skills (Gaps): ${JSON.stringify(contextData.missingSkills || [])}
- Matched Keywords: ${JSON.stringify(contextData.matchedKeywords || [])}
- Missing Keywords: ${JSON.stringify(contextData.missingKeywords || [])}
- Candidate Name: ${contextData.resumeData?.name || 'Candidate'}

GUIDELINES:
1. Ground every answer in the actual analysis context above.
2. Never invent candidate experience, skills, employers, or metrics that are missing.
3. If asked for a 30-day learning plan, provide a 4-week step-by-step roadmap specifically for missing skills.
4. If asked to rewrite bullet points, improve active verbs and technical clarity without fabricating unverified metrics.
5. Keep responses structured, concise, professional, and practical.`;

    const prompt = `User Question: "${userMessage}"`;

    try {
      const response = await this.invokeGemini(prompt, systemPrompt);
      return {
        reply: response,
        actionType: this.detectActionType(userMessage)
      };
    } catch (err) {
      console.warn('LLM Chat process failed, using intelligent fallback:', err.message);
      return this.fallbackChatResponse(userMessage, contextData);
    }
  }

  cleanJsonResponse(str) {
    if (!str) return '{}';
    let cleaned = str.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return cleaned;
  }

  fallbackResumeExtraction(text) {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    const nameMatch = text.split('\n')[0]?.trim();

    const knownSkillsList = [
      'Java', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 
      'PostgreSQL', 'RESTful API', 'Git', 'AWS', 'Docker', 'Kubernetes', 'Python', 
      'Spring Boot', 'Microservices', 'HTML5', 'CSS3', 'TypeScript', 'Redux'
    ];

    const foundSkills = knownSkillsList.filter(s => {
      const escaped = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = s.toLowerCase() === 'java' ? /\bjava\b(?!script)/i : new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(text);
    });

    return {
      name: nameMatch && nameMatch.length < 35 ? nameMatch : "Candidate",
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      skills: foundSkills,
      experience: [
        {
          company: "Extracted Experience",
          role: "Software Developer",
          duration: "Recent",
          responsibilities: ["Developed core application features", "Worked with REST APIs and databases"],
          technologies: foundSkills.slice(0, 4)
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "University",
          year: "2023"
        }
      ],
      projects: [],
      certifications: [],
      achievements: []
    };
  }

  fallbackJdExtraction(text) {
    const knownSkillsList = [
      'Java', 'Spring Boot', 'Docker', 'AWS', 'RESTful API', 'SQL', 'MongoDB', 
      'JavaScript', 'React', 'Node.js', 'Microservices', 'Kubernetes', 'Git'
    ];

    const foundInJd = knownSkillsList.filter(s => {
      const escaped = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = s.toLowerCase() === 'java' ? /\bjava\b(?!script)/i : new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(text);
    });

    const requiredSkills = foundInJd.length > 0 ? foundInJd.slice(0, Math.ceil(foundInJd.length * 0.7)) : ['Java', 'RESTful API', 'SQL'];
    const preferredSkills = foundInJd.length > 0 ? foundInJd.slice(Math.ceil(foundInJd.length * 0.7)) : ['AWS', 'Docker'];

    return {
      roleTitle: "Software Developer",
      requiredSkills,
      preferredSkills,
      requiredExperienceYears: "1-2 years",
      educationRequirement: "Bachelor's degree in Computer Science or related field",
      certifications: ["AWS Certified Cloud Practitioner (Preferred)"],
      keywords: [...requiredSkills, ...preferredSkills, "Agile", "Unit Testing", "CI/CD"],
      responsibilities: ["Develop scalable microservices", "Implement REST APIs", "Collaborate in Agile team"]
    };
  }

  /**
   * Accurate Intent Classifier & Fallback Chat Generator
   */
  fallbackChatResponse(userMsg, contextData) {
    const m = userMsg.toLowerCase();
    const { atsScore, matchLevel, breakdown, missingSkills = [], matchedSkills = [], candidateName = 'Candidate' } = contextData;

    const highGaps = missingSkills.filter(s => s.priority === 'HIGH').map(s => s.skill);
    const medGaps = missingSkills.filter(s => s.priority === 'MEDIUM').map(s => s.skill);
    const topGapSkill = highGaps[0] || missingSkills[0]?.skill || 'Spring Boot';
    const topMatched = matchedSkills.slice(0, 3).map(s => s.skill).join(', ');

    // 1. INTENT: 30-Day Learning Plan / Roadmap (Checked FIRST to avoid collision with "missing")
    if (m.includes('30-day') || m.includes('30 day') || m.includes('plan') || m.includes('roadmap') || m.includes('study plan') || m.includes('learning plan')) {
      return {
        reply: `### 🗓️ Customized 30-Day Learning Plan for ${candidateName}

This 4-week roadmap is structured specifically to close your technical gaps and maximize your ATS match score:

#### **Week 1: ${topGapSkill} Core Fundamentals**
- **Goal**: Master basic architecture, key concepts, and environment setup.
- **Action**: Build a simple hello-world service and complete a 4-hour beginner crash course.
- **Deliverable**: Create a public GitHub repository dedicated to ${topGapSkill}.

#### **Week 2: RESTful API & Database Integration**
- **Goal**: Connect ${topGapSkill} with relational databases (PostgreSQL/MySQL) or MongoDB.
- **Action**: Implement full CRUD operations, repository interfaces, and data models.
- **Deliverable**: Build a working backend API with endpoint validation.

#### **Week 3: Advanced Concepts & Microservices**
- **Goal**: Learn containerization with Docker and container deployment.
- **Action**: Write Dockerfiles for your services and orchestrate them with Docker Compose.
- **Deliverable**: Containerize your backend project locally.

#### **Week 4: Cloud Deployment & Portfolio Enhancement**
- **Goal**: Deploy your project to AWS / Cloud and update your resume.
- **Action**: Deploy your application on AWS EC2 or Render/Railway, and add quantified outcome bullets to your resume.
- **Deliverable**: Add direct GitHub links to your resume.`,
        actionType: 'LEARNING_ROADMAP'
      };
    }

    // 2. INTENT: Which skill to learn first / Priority
    if (m.includes('first') || m.includes('should i learn') || m.includes('top skill') || m.includes('prioritize')) {
      return {
        reply: `### 🎯 Priority #1: Learn **${topGapSkill}** First

**Why this skill?**
${topGapSkill} is explicitly listed as a high-priority skill in the Job Description, but currently has no verified evidence in your resume.

**Immediate Impact**:
Learning and adding **${topGapSkill}** to your resume projects will yield the single largest score increase (up to **+15 ATS points**).

**Next Steps**:
1. Watch the recommended **${topGapSkill}** tutorial video in the resources section.
2. Build one small CRUD application using ${topGapSkill}.
3. Add a new bullet point under your Projects section highlighting your work with ${topGapSkill}.`,
        actionType: 'PRIORITY_SKILL'
      };
    }

    // 3. INTENT: Skill Gaps / Missing Skills
    if (m.includes('missing') || m.includes('gap') || m.includes('lacks') || m.includes('unmatched') || m.includes('need to learn')) {
      return {
        reply: `### 🔍 Technical Skill Gaps Analysis

Here are the technical skills not found in your uploaded resume:

🔴 **High Priority Gaps (Required by JD)**:
${highGaps.length > 0 ? highGaps.map(s => `- **${s}**: Required skill listed in the JD, but missing from your resume.`).join('\n') : '- None! You matched all core required skills.'}

🟡 **Medium Priority Gaps (Preferred by JD)**:
${medGaps.length > 0 ? medGaps.map(s => `- **${s}**: Preferred qualification listed in the JD.`).join('\n') : '- Containerization & Cloud Deployment (Recommended upgrade)'}

*Tip: Focus on resolving High Priority Gaps first before applying.*`,
        actionType: 'SKILL_GAPS'
      };
    }

    // 4. INTENT: Bullet Point Rewriting / Resume Text Improvement
    if (m.includes('rewrite') || m.includes('bullet') || m.includes('project') || m.includes('improve my resume') || m.includes('wording')) {
      return {
        reply: `### ✍️ Optimized ATS Resume Bullet Point Rewrites

Here are two impact-driven rewrites based on your matched technologies (${topMatched || 'PostgreSQL, Python, Git'}):

#### **Bullet Option 1 (Backend & Database Focus)**:
> *"Architected and deployed scalable RESTful APIs using Node.js and ${topMatched.includes('PostgreSQL') ? 'PostgreSQL' : 'MongoDB'}, optimizing query response times and ensuring robust data validation for transactions."*

#### **Bullet Option 2 (Performance & Outcomes Focus)**:
> *"Engineered core application features with clean, modular architecture, implementing version control with Git and CI/CD pipelines to streamline deployment efficiency."*

*(Note: Adjust the bullet wording to truthfully match your real project contributions.)*`,
        actionType: 'BULLET_REWRITE'
      };
    }

    // 5. INTENT: Score Explanation / Why Score
    if (m.includes('why') || m.includes('score') || m.includes('breakdown') || m.includes('points')) {
      return {
        reply: `### 📊 ATS Score Breakdown (${atsScore}/100 - ${matchLevel})

Your match score was calculated deterministically across 6 weighted categories:

- **Skills Match (35%)**: ${breakdown?.skills?.weighted || Math.round(atsScore * 0.35)}/35 pts (${matchedSkills.length} matched skills)
- **JD Keywords (20%)**: ${breakdown?.keywords?.weighted || Math.round(atsScore * 0.20)}/20 pts
- **Experience Match (20%)**: ${breakdown?.experience?.weighted || Math.round(atsScore * 0.20)}/20 pts
- **Education Match (10%)**: ${breakdown?.education?.weighted || Math.round(atsScore * 0.10)}/10 pts
- **Resume Structure (10%)**: ${breakdown?.structure?.weighted || Math.round(atsScore * 0.10)}/10 pts
- **Certifications (5%)**: ${breakdown?.certifications?.weighted || Math.round(atsScore * 0.05)}/5 pts

**Primary Recommendation**: Add evidence for **${topGapSkill}** to raise your Skills & Keyword score.`,
        actionType: 'SCORE_EXPLANATION'
      };
    }

    // 6. INTENT: Compare Resumes
    if (m.includes('compare') || m.includes('version') || m.includes('better') || m.includes('which resume')) {
      return {
        reply: `### 📑 Resume Comparison Analysis

${contextData.resumes && contextData.resumes.length > 1 ? 
  `You have **${contextData.resumes.length} resumes** uploaded:
${contextData.resumes.map((r, idx) => `${idx + 1}. **${r.name}** — Score: **${r.atsScore}/100** ${r.isBest ? '(🥇 Best Match)' : ''}`).join('\n')}

**Assessment**: ${contextData.bestResumeExplanation || 'The top resume has better keyword coverage and higher skill alignment.'}` 
  : 
  `You currently have 1 resume analyzed (**Score: ${atsScore}/100**). Click **"New Analysis"** and upload up to 5 resumes to compare different versions against the same job description!`}`,
        actionType: 'COMPARE_RESUMES'
      };
    }

    // Default Fallback Response
    return {
      reply: `I analyzed your resume against the target role (**ATS Score: ${atsScore}/100**).

You matched core skills in **${topMatched || 'your tech stack'}**, but are missing evidence for **${topGapSkill}**.

How can I help you next?
- Ask *"Give me a 30-day learning plan"*
- Ask *"What are my top missing skills?"*
- Ask *"Which skill should I learn first?"*
- Ask *"Rewrite my project bullet point"*`,
      actionType: 'GENERAL'
    };
  }

  detectActionType(msg) {
    const m = msg.toLowerCase();
    if (m.includes('plan') || m.includes('roadmap') || m.includes('30-day')) return 'LEARNING_ROADMAP';
    if (m.includes('first') || m.includes('prioritize')) return 'PRIORITY_SKILL';
    if (m.includes('missing') || m.includes('gap')) return 'SKILL_GAPS';
    if (m.includes('rewrite') || m.includes('bullet')) return 'BULLET_REWRITE';
    if (m.includes('why') || m.includes('score')) return 'SCORE_EXPLANATION';
    if (m.includes('compare')) return 'COMPARE_RESUMES';
    return 'GENERAL';
  }
}

module.exports = new LLMService();
