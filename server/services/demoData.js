/**
 * Deterministic Hackathon Demo Dataset
 * Realistic sample resume & JD with pre-analyzed deterministic results for instant testing.
 */

const DEMO_JD_TEXT = `Software Developer - Full Stack / Backend

We are looking for a Software Developer to join our core engineering team.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable Java & REST API backend services.
- Develop responsive web applications using modern JavaScript frameworks.
- Write clean SQL queries and manage relational database schemas.
- Participate in code reviews and Agile sprint ceremonies.

Requirements (Required):
- Strong proficiency in Java core concepts and object-oriented design.
- Hands-on experience building web applications with Spring Boot.
- Experience building and consuming RESTful APIs.
- Solid understanding of SQL databases and query optimization.
- Proficiency with Git version control.

Preferred Qualifications:
- Familiarity with containerization using Docker.
- Basic knowledge of Cloud platforms (AWS EC2, S3, RDS).
- Understanding of Microservices architecture.

Experience: 0 - 2 years
Education: Bachelor's degree in Computer Science, Software Engineering, or related field.`;

const DEMO_RESUME_TEXT = `ALEX MORGAN
Email: alex.morgan@example.com | Phone: (555) 234-5678
LinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexmorgan-dev
Location: San Francisco, CA

SUMMARY
Enthusiastic Software Engineer with hands-on experience in full-stack web application development, Java, JavaScript, REST APIs, and database management. Passionate about writing clean, maintainable code and solving complex technical problems.

TECHNICAL SKILLS
- Programming Languages: Java, JavaScript, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Node.js, Express.js
- Databases: MongoDB, MySQL
- Tools & Platforms: Git, GitHub, Postman, VS Code

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | Graduated: May 2023
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming in Java, Database Systems, Web Development.

PROJECTS
SmartShop E-Commerce Platform | Java, React, Node.js, MongoDB, RESTful APIs
- Developed a full-stack e-commerce web application featuring user authentication, product search, and cart management.
- Implemented robust RESTful APIs in Node.js and Express to handle transactions and user session tokens.
- Designed MongoDB schemas and optimized query response times by 30%.

TaskFlow Productivity App | Java, SQL, Git
- Built a Java desktop application for task management utilizing OOP principles and clean MVC architecture.
- Integrated MySQL database for persistent task storage and user state management.

CERTIFICATIONS
- Java SE 11 Developer Fundamentals (2023)
- Meta Front-End Developer Professional Certificate (2023)`;

const DEMO_ANALYSIS_RESULT = {
  id: "demo-analysis-001",
  title: "Software Developer — Alex Morgan Resume Analysis",
  jdTitle: "Software Developer - Full Stack / Backend",
  candidateName: "Alex Morgan",
  candidateEmail: "alex.morgan@example.com",
  atsScore: 82,
  matchLevel: "Strong Match",
  jobReadinessScore: 74,
  breakdown: {
    skills: { raw: 88, weighted: 31, maxWeighted: 35 },
    keywords: { raw: 85, weighted: 17, maxWeighted: 20 },
    experience: { raw: 80, weighted: 16, maxWeighted: 20 },
    education: { raw: 90, weighted: 9, maxWeighted: 10 },
    structure: { raw: 60, weighted: 6, maxWeighted: 10 },
    certifications: { raw: 60, weighted: 3, maxWeighted: 5 }
  },
  matchedSkills: [
    { skill: "Java", priority: "HIGH", evidence: "Found in Skills section & Projects text", confidence: 1.0 },
    { skill: "RESTful API", priority: "HIGH", evidence: "Found in SmartShop project description", confidence: 0.95 },
    { skill: "SQL", priority: "HIGH", evidence: "Found in Skills & TaskFlow project text", confidence: 0.95 },
    { skill: "JavaScript", priority: "MEDIUM", evidence: "Found in Skills section", confidence: 1.0 },
    { skill: "React", priority: "MEDIUM", evidence: "Found in Skills section & SmartShop project", confidence: 1.0 },
    { skill: "Node.js", priority: "MEDIUM", evidence: "Found in Skills & SmartShop project", confidence: 1.0 },
    { skill: "MongoDB", priority: "MEDIUM", evidence: "Found in Skills & SmartShop project", confidence: 1.0 },
    { skill: "Git", priority: "HIGH", evidence: "Found in Skills & TaskFlow project", confidence: 1.0 }
  ],
  missingSkills: [
    { skill: "Spring Boot", priority: "HIGH", reason: "Required skill listed in Job Description but not found in resume." },
    { skill: "Docker", priority: "HIGH", reason: "Required/Preferred containerization skill not found in resume." },
    { skill: "Amazon Web Services", priority: "MEDIUM", reason: "Preferred cloud platform qualification not found in resume." },
    { skill: "Microservices", priority: "LOW", reason: "Preferred architectural pattern not found in resume." }
  ],
  matchedKeywords: ["Java", "RESTful API", "SQL", "Git", "JavaScript", "React", "Node.js"],
  missingKeywords: ["Spring Boot", "Docker", "Amazon Web Services", "Microservices", "CI/CD"],
  experienceEval: {
    score: 80,
    assessment: "Partial match. The JD requests 0-2 years experience. Candidate shows 2 hands-on projects (SmartShop & TaskFlow) covering Java, REST APIs, and SQL.",
    details: "Strong project foundations, but lacks production enterprise experience with Spring Boot framework."
  },
  educationEval: {
    score: 90,
    assessment: "Strong match. Found B.S. in Computer Science from UC Berkeley.",
    details: "Directly satisfies the CS/Software Engineering degree requirement."
  },
  certificationsEval: {
    score: 60,
    assessment: "Related certifications found.",
    details: "Found Java SE 11 Developer Fundamentals and Meta Front-End Certificate."
  },
  structureEval: {
    score: 60,
    healthItems: [
      { category: "Structure", score: 8, feedback: "Clean section headers and standard formatting." },
      { category: "Readability", score: 9, feedback: "Clear bullet points and easy-to-read contact metadata." },
      { category: "Keywords", score: 7, feedback: "Good core keyword density for Java and REST APIs." },
      { category: "Achievements", score: 6, feedback: "Some project descriptions focus on responsibilities rather than measurable business outcomes." },
      { category: "ATS Compatibility", score: 8, feedback: "Standard single-column text layout readable by ATS parsers." }
    ],
    issues: [
      "Project bullets describe what was built but lack quantified metric impact (e.g. latency improvement, user scale).",
      "Spring Boot is missing from the skills section despite being required by the target job.",
      "No direct evidence of Docker or containerization tools listed."
    ]
  },
  recommendations: [
    {
      title: "Add Spring Boot to Skills & Projects",
      priority: "HIGH",
      action: "Learn Spring Boot basics, convert one Java project to a Spring Boot REST API, and highlight it on your resume."
    },
    {
      title: "Highlight Containerization with Docker",
      priority: "HIGH",
      action: "Create a Dockerfile for your SmartShop Node/Java backend and list Docker under Tools & Technologies."
    },
    {
      title: "Quantify Project Outcomes",
      priority: "MEDIUM",
      action: "Rewrite project bullet points to emphasize measurable achievements and performance improvements."
    }
  ],
  learningRoadmap: [
    {
      step: 1,
      skill: "Spring Boot",
      title: "Spring Boot 3 Fundamentals & Dependency Injection",
      duration: "Week 1",
      status: "High Priority Gap"
    },
    {
      step: 2,
      skill: "Spring Boot",
      title: "Building RESTful Web Services with Spring Web",
      duration: "Week 2",
      status: "Core JD Skill"
    },
    {
      step: 3,
      skill: "Docker",
      title: "Docker Containerization & Docker Compose",
      duration: "Week 3",
      status: "Containerization Skill"
    },
    {
      step: 4,
      skill: "Amazon Web Services",
      title: "Deploying Spring Boot & Docker to AWS EC2",
      duration: "Week 4",
      status: "Cloud Deployment"
    }
  ],
  resumes: [
    { name: "Alex_Morgan_Resume_Final.pdf", atsScore: 82, isBest: true }
  ]
};

module.exports = {
  DEMO_JD_TEXT,
  DEMO_RESUME_TEXT,
  DEMO_ANALYSIS_RESULT
};
