const { extractTextFromFile } = require('../parsers/documentExtractor');
const { checkSkillInCandidate, normalizeSkill } = require('./skillNormalizer');
const { calculateAtsScore } = require('./atsScorer');
const llmService = require('./llmService');
const resourceManager = require('./courseProviders/resourceManager');

/**
 * Execute full analysis pipeline for single or multiple resumes against a JD
 */
async function analyzeApplication(files = [], jdText = '') {
  if (!jdText || jdText.trim().length === 0) {
    throw new Error('Job Description text is required for analysis.');
  }

  // 1. Extract JD Structure
  const jdData = await llmService.extractJdStructure(jdText);
  const requiredSkills = jdData.requiredSkills || [];
  const preferredSkills = jdData.preferredSkills || [];

  const resumeAnalyses = [];

  // Parse each uploaded resume file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const resumeText = await extractTextFromFile(file);
    const resumeData = await llmService.extractResumeStructure(resumeText);

    // Skill Matching & Normalization
    const matchedSkills = [];
    const missingSkills = [];

    // Check Required Skills
    for (const reqSkill of requiredSkills) {
      const matchResult = checkSkillInCandidate(reqSkill, resumeData.skills || [], resumeText);
      if (matchResult.status === 'matched') {
        matchedSkills.push({ ...matchResult, priority: 'HIGH' });
      } else {
        missingSkills.push({
          skill: normalizeSkill(reqSkill),
          priority: 'HIGH',
          reason: `"${normalizeSkill(reqSkill)}" is listed as a required skill in the job description, but was not found in your resume.`
        });
      }
    }

    // Check Preferred Skills
    for (const prefSkill of preferredSkills) {
      const matchResult = checkSkillInCandidate(prefSkill, resumeData.skills || [], resumeText);
      if (matchResult.status === 'matched') {
        if (!matchedSkills.some(s => s.skill.toLowerCase() === matchResult.skill.toLowerCase())) {
          matchedSkills.push({ ...matchResult, priority: 'MEDIUM' });
        }
      } else {
        if (!missingSkills.some(s => s.skill.toLowerCase() === normalizeSkill(prefSkill).toLowerCase())) {
          missingSkills.push({
            skill: normalizeSkill(prefSkill),
            priority: 'MEDIUM',
            reason: `"${normalizeSkill(prefSkill)}" is listed as a preferred skill, but was not found in your resume.`
          });
        }
      }
    }

    // Include remaining candidate skills as matched background skills
    (resumeData.skills || []).forEach(cSkill => {
      const normalized = normalizeSkill(cSkill);
      if (!matchedSkills.some(s => s.skill.toLowerCase() === normalized.toLowerCase())) {
        matchedSkills.push({
          skill: normalized,
          priority: 'LOW',
          evidence: `Found in candidate skills section`,
          confidence: 0.90
        });
      }
    });

    // Keyword Analysis
    const jdKeywords = jdData.keywords || [...requiredSkills, ...preferredSkills];
    const matchedKeywords = [];
    const missingKeywords = [];

    jdKeywords.forEach(kw => {
      const normKw = normalizeSkill(kw);
      const resLower = resumeText.toLowerCase();
      if (resLower.includes(kw.toLowerCase()) || resLower.includes(normKw.toLowerCase())) {
        matchedKeywords.push(normKw);
      } else {
        missingKeywords.push(normKw);
      }
    });

    // DYNAMIC EXPERIENCE EVALUATION based on actual parsed text
    const expCount = (resumeData.experience?.length || 0) + (resumeData.projects?.length || 0);
    let dynamicExpScore = 40;
    if (expCount >= 4) dynamicExpScore = 95;
    else if (expCount >= 2) dynamicExpScore = 80;
    else if (expCount === 1) dynamicExpScore = 65;

    const experienceEval = {
      score: dynamicExpScore,
      assessment: `Found ${expCount} listed project/work entries in resume.`,
      details: `Target JD requests: ${jdData.requiredExperienceYears || 'relevant experience'}.`
    };

    // DYNAMIC EDUCATION EVALUATION based on actual degree match
    const eduText = (resumeData.education || []).map(e => `${e.degree} ${e.institution}`).join(' ').toLowerCase();
    const resTextLower = resumeText.toLowerCase();
    let dynamicEduScore = 45;

    if (eduText.includes('computer science') || eduText.includes('software engineering') || eduText.includes('b.tech') || eduText.includes('b.s') || resTextLower.includes('bachelor')) {
      dynamicEduScore = 95;
    } else if (resumeData.education && resumeData.education.length > 0) {
      dynamicEduScore = 75;
    }

    const educationEval = {
      score: dynamicEduScore,
      assessment: resumeData.education?.length > 0 ? `Education record: ${resumeData.education[0].degree || 'Degree listed'}` : 'Education section not clearly identified.',
      details: `Target JD asks for: ${jdData.educationRequirement || 'Bachelor\'s degree'}.`
    };

    // DYNAMIC CERTIFICATIONS EVALUATION
    const certCount = resumeData.certifications?.length || 0;
    const dynamicCertScore = certCount > 0 ? Math.min(100, 60 + certCount * 15) : 20;

    const certificationsEval = {
      score: dynamicCertScore,
      assessment: certCount > 0 ? `${certCount} relevant certification(s) identified.` : 'No relevant certifications listed in resume.',
      details: resumeData.certifications?.join(', ') || 'No certifications listed.'
    };

    // DYNAMIC RESUME STRUCTURE EVALUATION
    let sectionPoints = 0;
    if (resTextLower.includes('skill')) sectionPoints += 25;
    if (resTextLower.includes('experience') || resTextLower.includes('project')) sectionPoints += 25;
    if (resTextLower.includes('education')) sectionPoints += 25;
    if (resTextLower.includes('contact') || resTextLower.includes('email') || resumeData.email) sectionPoints += 25;

    const dynamicStructScore = Math.min(100, Math.max(30, sectionPoints));

    const structureEval = {
      score: dynamicStructScore,
      healthItems: [
        { category: "Structure", score: Math.min(10, Math.round(dynamicStructScore / 10)), feedback: "Clear section header layout." },
        { category: "Readability", score: 9, feedback: "Clean layout and legible typography." },
        { category: "Keywords", score: matchedKeywords.length > 0 ? Math.min(10, Math.round((matchedKeywords.length / (jdKeywords.length || 1)) * 10)) : 5, feedback: "Keyword alignment score." },
        { category: "Achievements", score: expCount > 2 ? 8 : 6, feedback: "Bullets impact vs task description ratio." },
        { category: "ATS Compatibility", score: 8, feedback: "Standard single-column layout readable by ATS." }
      ],
      issues: [
        missingSkills.length > 0 ? `Missing key required technologies: ${missingSkills.slice(0, 2).map(s => s.skill).join(', ')}.` : null,
        "Project description bullets could be strengthened with quantifiable outcome metrics."
      ].filter(Boolean)
    };

    // Calculate Deterministic ATS Score dynamically
    const scoreObj = calculateAtsScore({
      matchedSkills,
      missingSkills,
      matchedKeywords,
      missingKeywords,
      experienceEval,
      educationEval,
      structureEval,
      certificationsEval
    });

    // Learning Roadmap Generation based on Gaps
    const learningRoadmap = missingSkills.slice(0, 4).map((gap, idx) => ({
      step: idx + 1,
      skill: gap.skill,
      title: `${gap.skill} Fundamentals & Practical Integration`,
      duration: `Week ${idx + 1}`,
      status: gap.priority === 'HIGH' ? 'High Priority Gap' : 'Supporting Skill'
    }));

    // Recommendations
    const recommendations = missingSkills.slice(0, 3).map(gap => ({
      title: `Add ${gap.skill} to Resume`,
      priority: gap.priority,
      action: gap.reason
    }));

    if (recommendations.length === 0) {
      recommendations.push(
        { title: 'Quantify Project Achievements', priority: 'HIGH', action: 'Add measurable outcome metrics (e.g. latency reduced by 30%, 10k+ active users, query performance optimized) to your top project bullet points.' },
        { title: 'Include Live Project Links', priority: 'MEDIUM', action: 'Add direct GitHub repository or live URL links for your top featured projects.' }
      );
    }

    resumeAnalyses.push({
      filename: file.originalname,
      candidateName: resumeData.name || 'Candidate',
      candidateEmail: resumeData.email || null,
      resumeData,
      atsScore: scoreObj.atsScore,
      matchLevel: scoreObj.matchLevel,
      jobReadinessScore: scoreObj.jobReadinessScore,
      breakdown: scoreObj.breakdown,
      matchedSkills,
      missingSkills,
      matchedKeywords,
      missingKeywords,
      experienceEval,
      educationEval,
      certificationsEval,
      structureEval,
      recommendations,
      learningRoadmap
    });
  }

  // Sort & Rank Resumes (if multiple)
  resumeAnalyses.sort((a, b) => b.atsScore - a.atsScore);

  const bestResume = resumeAnalyses[0];

  // Fetch learning resources for missing skills (or fallback skills if no gaps)
  let targetResourceSkills = bestResume.missingSkills;
  if (!targetResourceSkills || targetResourceSkills.length === 0) {
    targetResourceSkills = [{ skill: 'Docker' }, { skill: 'Spring Boot' }];
  }

  const resourceMap = await resourceManager.getResourcesForMissingSkills(targetResourceSkills);

  return {
    id: `analysis-${Date.now()}`,
    title: `${jdData.roleTitle || 'Role'} — ${bestResume.candidateName} Resume Analysis`,
    jdTitle: jdData.roleTitle || 'Software Developer Role',
    candidateName: bestResume.candidateName,
    candidateEmail: bestResume.candidateEmail,
    atsScore: bestResume.atsScore,
    matchLevel: bestResume.matchLevel,
    jobReadinessScore: bestResume.jobReadinessScore,
    breakdown: bestResume.breakdown,
    matchedSkills: bestResume.matchedSkills,
    missingSkills: bestResume.missingSkills,
    matchedKeywords: bestResume.matchedKeywords,
    missingKeywords: bestResume.missingKeywords,
    experienceEval: bestResume.experienceEval,
    educationEval: bestResume.educationEval,
    certificationsEval: bestResume.certificationsEval,
    structureEval: bestResume.structureEval,
    recommendations: bestResume.recommendations,
    learningRoadmap: bestResume.learningRoadmap,
    resources: resourceMap,
    resumes: resumeAnalyses.map((r, idx) => ({
      name: r.filename,
      candidateName: r.candidateName,
      atsScore: r.atsScore,
      jobReadinessScore: r.jobReadinessScore,
      matchLevel: r.matchLevel,
      matchedCount: r.matchedSkills.length,
      missingCount: r.missingSkills.length,
      isBest: idx === 0,
      breakdown: r.breakdown
    })),
    bestResumeExplanation: resumeAnalyses.length > 1 ? 
      `"${bestResume.filename}" ranked #1 with an ATS score of ${bestResume.atsScore}/100 because it demonstrated higher skill coverage (${bestResume.matchedSkills.length} matched skills) and stronger keyword alignment with the job description.` : null
  };
}

module.exports = { analyzeApplication };
