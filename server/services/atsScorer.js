/**
 * Dynamic Deterministic ATS Scoring Engine
 * Computes exact 100-point weighted category scores dynamically based on extracted resume & JD data.
 * 
 * Formula:
 * - Skills Match: 35%
 * - JD Keywords: 20%
 * - Experience Match: 20%
 * - Education: 10%
 * - Resume Structure: 10%
 * - Certifications: 5%
 */

function calculateAtsScore(analysisData) {
  const {
    matchedSkills = [],
    missingSkills = [],
    matchedKeywords = [],
    missingKeywords = [],
    experienceEval = {},
    educationEval = {},
    structureEval = {},
    certificationsEval = {}
  } = analysisData;

  // 1. Skills Score (0 - 100) -> Weight: 35%
  const totalSkills = matchedSkills.length + missingSkills.length;
  let skillsScoreRaw = 0;
  if (totalSkills > 0) {
    let weightedPoints = 0;
    let totalPossibleWeights = 0;

    matchedSkills.forEach(s => {
      const weight = s.priority === 'HIGH' ? 3 : (s.priority === 'MEDIUM' ? 2 : 1);
      weightedPoints += weight;
      totalPossibleWeights += weight;
    });

    missingSkills.forEach(s => {
      const weight = s.priority === 'HIGH' ? 3 : (s.priority === 'MEDIUM' ? 2 : 1);
      totalPossibleWeights += weight;
    });

    skillsScoreRaw = Math.min(100, Math.round((weightedPoints / (totalPossibleWeights || 1)) * 100));
  } else {
    skillsScoreRaw = matchedSkills.length > 0 ? 80 : 30;
  }
  const skillsScoreWeighted = Math.round(skillsScoreRaw * 0.35); // Max 35

  // 2. Keywords Score (0 - 100) -> Weight: 20%
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const keywordsScoreRaw = totalKeywords > 0 
    ? Math.min(100, Math.round((matchedKeywords.length / totalKeywords) * 100))
    : 50;
  const keywordsScoreWeighted = Math.round(keywordsScoreRaw * 0.20); // Max 20

  // 3. Experience Score (0 - 100) -> Weight: 20%
  const expScoreRaw = Math.min(100, Math.max(10, Number(experienceEval.score) || 60));
  const expScoreWeighted = Math.round(expScoreRaw * 0.20); // Max 20

  // 4. Education Score (0 - 100) -> Weight: 10%
  const eduScoreRaw = Math.min(100, Math.max(10, Number(educationEval.score) || 70));
  const eduScoreWeighted = Math.round(eduScoreRaw * 0.10); // Max 10

  // 5. Resume Structure Score (0 - 100) -> Weight: 10%
  const structScoreRaw = Math.min(100, Math.max(10, Number(structureEval.score) || 65));
  const structScoreWeighted = Math.round(structScoreRaw * 0.10); // Max 10

  // 6. Certifications Score (0 - 100) -> Weight: 5%
  const certScoreRaw = Math.min(100, Math.max(0, Number(certificationsEval.score) || 20));
  const certScoreWeighted = Math.round(certScoreRaw * 0.05); // Max 5

  // Total ATS Score calculation
  const totalAtsScore = Math.min(100, Math.max(0,
    skillsScoreWeighted +
    keywordsScoreWeighted +
    expScoreWeighted +
    eduScoreWeighted +
    structScoreWeighted +
    certScoreWeighted
  ));

  // Determine Match Assessment Badge
  let matchLevel = 'Needs Improvement';
  if (totalAtsScore >= 85) matchLevel = 'Excellent Match';
  else if (totalAtsScore >= 75) matchLevel = 'Strong Match';
  else if (totalAtsScore >= 60) matchLevel = 'Moderate Match';

  // Calculate separate Job Readiness Score
  const highPriorityMissingCount = missingSkills.filter(s => s.priority === 'HIGH').length;
  const readinessPenalty = highPriorityMissingCount * 9;
  const jobReadinessScore = Math.min(100, Math.max(10, Math.round(totalAtsScore - readinessPenalty)));

  return {
    atsScore: totalAtsScore,
    matchLevel,
    jobReadinessScore,
    breakdown: {
      skills: { raw: skillsScoreRaw, weighted: skillsScoreWeighted, maxWeighted: 35 },
      keywords: { raw: keywordsScoreRaw, weighted: keywordsScoreWeighted, maxWeighted: 20 },
      experience: { raw: expScoreRaw, weighted: expScoreWeighted, maxWeighted: 20 },
      education: { raw: eduScoreRaw, weighted: eduScoreWeighted, maxWeighted: 10 },
      structure: { raw: structScoreRaw, weighted: structScoreWeighted, maxWeighted: 10 },
      certifications: { raw: certScoreRaw, weighted: certScoreWeighted, maxWeighted: 5 }
    }
  };
}

module.exports = { calculateAtsScore };
