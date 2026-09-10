const YouTubeProvider = require('./youtubeProvider');
const CourseCatalogProvider = require('./courseCatalogProvider');
const CuratedProvider = require('./curatedProvider');

class ResourceManager {
  constructor() {
    this.youtubeProvider = new YouTubeProvider();
    this.courseCatalogProvider = new CourseCatalogProvider();
    this.curatedProvider = new CuratedProvider();
  }

  /**
   * Fetch aggregated, normalized, deduplicated resources for a missing skill
   */
  async getResourcesForSkill(skill, level = 'Beginner') {
    if (!skill) return [];

    try {
      // Execute providers in parallel
      const [ytResults, catalogResults, curatedResults] = await Promise.all([
        this.youtubeProvider.getResources(skill),
        this.courseCatalogProvider.getResources(skill),
        this.curatedProvider.getResources(skill)
      ]);

      // Combine results
      const combined = [...ytResults, ...catalogResults, ...curatedResults];

      // Deduplicate by URL
      const seenUrls = new Set();
      const deduplicated = [];

      for (const res of combined) {
        if (!res.url || seenUrls.has(res.url)) continue;
        seenUrls.add(res.url);
        deduplicated.push(res);
      }

      // Ranking heuristic:
      // 1. Curated / YouTube beginner courses
      // 2. Matching target level
      deduplicated.sort((a, b) => {
        const aIsVideo = a.type === 'video' ? 1 : 0;
        const bIsVideo = b.type === 'video' ? 1 : 0;
        return bIsVideo - aIsVideo;
      });

      return deduplicated.slice(0, 4);
    } catch (err) {
      console.error(`Error aggregating resources for ${skill}:`, err.message);
      // Absolute fallback to curated provider
      return this.curatedProvider.getResources(skill);
    }
  }

  /**
   * Batch fetch resources for multiple missing skills
   */
  async getResourcesForMissingSkills(missingSkills = []) {
    const resourceMap = {};
    for (const skillObj of missingSkills.slice(0, 4)) {
      const skillName = typeof skillObj === 'string' ? skillObj : skillObj.skill;
      if (skillName) {
        resourceMap[skillName] = await this.getResourcesForSkill(skillName);
      }
    }
    return resourceMap;
  }
}

module.exports = new ResourceManager();
