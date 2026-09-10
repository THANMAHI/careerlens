const axios = require('axios');

class YouTubeProvider {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
  }

  async getResources(skill) {
    if (!this.apiKey) {
      return [];
    }

    try {
      const query = `${skill} beginner tutorial course`;
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 4,
          type: 'video',
          videoCaption: 'any',
          key: this.apiKey
        },
        timeout: 5000
      });

      if (!response.data || !response.data.items) {
        return [];
      }

      return response.data.items.map(item => ({
        title: item.snippet.title,
        provider: `${item.snippet.channelTitle} (YouTube)`,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        type: 'video',
        skill: skill,
        level: 'Beginner',
        duration: 'Tutorial Video',
        description: item.snippet.description || ''
      }));
    } catch (err) {
      console.warn(`YouTube Data API failed for skill "${skill}":`, err.message);
      return [];
    }
  }
}

module.exports = YouTubeProvider;
