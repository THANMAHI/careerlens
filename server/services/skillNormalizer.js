/**
 * Skill Normalizer Layer
 * Map tech terms & aliases to canonical forms while ensuring Java != JavaScript guard.
 */

const SKILL_MAP = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'js/ts': 'JavaScript',
  'es6': 'JavaScript',
  'ecmascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'postgre': 'PostgreSQL',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'nosql': 'NoSQL',
  'rest': 'RESTful API',
  'rest api': 'RESTful API',
  'restful': 'RESTful API',
  'restful api': 'RESTful API',
  'rest apis': 'RESTful API',
  'aws': 'Amazon Web Services',
  'amazon web services': 'Amazon Web Services',
  'gcp': 'Google Cloud Platform',
  'azure': 'Microsoft Azure',
  'docker': 'Docker',
  'containerization': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'spring': 'Spring Boot',
  'springboot': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'microservice': 'Microservices',
  'microservices': 'Microservices',
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'Git',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'java': 'Java',
  'python': 'Python',
  'c++': 'C++',
  'cpp': 'C++',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'redux': 'Redux'
};

/**
 * Normalize skill string to canonical form
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  if (SKILL_MAP[cleaned]) {
    return SKILL_MAP[cleaned];
  }
  // Return cleaned titlecase default if not explicitly mapped
  return skill.trim();
}

/**
 * Strict skill equivalence check enforcing Java != JavaScript
 */
function areSkillsEquivalent(skill1, skill2) {
  const norm1 = normalizeSkill(skill1);
  const norm2 = normalizeSkill(skill2);

  // Exact canonical match
  if (norm1.toLowerCase() === norm2.toLowerCase()) {
    return true;
  }

  // Guard against Java matching JavaScript
  const s1Lower = norm1.toLowerCase();
  const s2Lower = norm2.toLowerCase();
  if ((s1Lower === 'java' && s2Lower === 'javascript') || (s1Lower === 'javascript' && s2Lower === 'java')) {
    return false;
  }

  return false;
}

/**
 * Match a target JD skill against a list of candidate skills and resume text evidence
 */
function checkSkillInCandidate(targetSkill, candidateSkills = [], resumeText = '') {
  const canonicalTarget = normalizeSkill(targetSkill);
  const targetLower = canonicalTarget.toLowerCase();

  // 1. Direct candidate skill match
  for (const cSkill of candidateSkills) {
    if (areSkillsEquivalent(canonicalTarget, cSkill)) {
      return {
        skill: canonicalTarget,
        status: 'matched',
        evidence: `Found in Skills section: "${cSkill}"`,
        confidence: 1.0
      };
    }
  }

  // 2. Text evidence match in resume text (with word boundary guard)
  if (resumeText) {
    const textLower = resumeText.toLowerCase();

    // Guard Java in text so it doesn't match 'JavaScript'
    if (targetLower === 'java') {
      const javaRegex = /\bjava\b(?!script)/i;
      if (javaRegex.test(resumeText)) {
        return {
          skill: canonicalTarget,
          status: 'matched',
          evidence: 'Mentioned in resume experience/projects text',
          confidence: 0.85
        };
      }
    } else {
      // General term search
      const escaped = targetLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(textLower)) {
        return {
          skill: canonicalTarget,
          status: 'matched',
          evidence: `Mentioned in resume text`,
          confidence: 0.85
        };
      }
    }
  }

  return {
    skill: canonicalTarget,
    status: 'missing',
    evidence: 'No supporting evidence found in resume',
    confidence: 0.0
  };
}

module.exports = {
  normalizeSkill,
  areSkillsEquivalent,
  checkSkillInCandidate
};
