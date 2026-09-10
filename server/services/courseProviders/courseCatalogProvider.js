const axios = require('axios');

class CourseCatalogProvider {
  constructor() {
    this.apiKey = process.env.COURSE_API_KEY;
    this.apiUrl = process.env.COURSE_API_URL;
  }

  async getResources(skill) {
    if (!this.apiKey || !this.apiUrl) {
      return [];
    }

    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: skill,
          api_key: this.apiKey,
          limit: 3
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 5000
      });

      if (!response.data || !Array.isArray(response.data.courses)) {
        return [];
      }

      return response.data.courses.map(course => ({
        title: course.title || course.name,
        provider: course.provider || 'Online Course Platform',
        url: course.url || course.link,
        thumbnail: course.thumbnail || '',
        type: 'course',
        skill: skill,
        level: course.level || 'Beginner',
        duration: course.duration || 'Flexible',
        description: course.description || ''
      }));
    } catch (err) {
      console.warn(`Course Catalog API failed for skill "${skill}":`, err.message);
      return [];
    }
  }
}

module.exports = CourseCatalogProvider;
