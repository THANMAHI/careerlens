/**
 * Curated Fallback Resource Provider
 * Contains verified, real educational courses and tutorials for key developer skills.
 * All URLs are real and verified (freeCodeCamp, YouTube, Official Docs, Coursera).
 */

const CURATED_RESOURCES = [
  // Spring Boot
  {
    title: "Spring Boot Full Course - Learn Spring Boot 3 in 4 Hours",
    provider: "freeCodeCamp.org (YouTube)",
    url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    thumbnail: "https://img.youtube.com/vi/9SGDpanrc8U/mqdefault.jpg",
    type: "video",
    skill: "Spring Boot",
    level: "Beginner",
    duration: "4 hours",
    description: "Comprehensive guide to Spring Boot 3, REST APIs, and Dependency Injection."
  },
  {
    title: "Building REST services with Spring",
    provider: "Spring.io Guides",
    url: "https://spring.io/guides/tutorials/rest/",
    thumbnail: "https://spring.io/images/og-spring.png",
    type: "article",
    skill: "Spring Boot",
    level: "Beginner",
    duration: "1 hour",
    description: "Official step-by-step guide to developing REST APIs with Spring Boot."
  },
  // Docker
  {
    title: "Docker Tutorial for Beginners - Full Course",
    provider: "TechWorld with Nana (YouTube)",
    url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    thumbnail: "https://img.youtube.com/vi/3c-iBn73dDE/mqdefault.jpg",
    type: "video",
    skill: "Docker",
    level: "Beginner",
    duration: "3 hours",
    description: "Learn Docker containers, images, networking, Docker Compose, and architecture."
  },
  {
    title: "Docker Curriculum - Comprehensive Getting Started Guide",
    provider: "DockerCurriculum.com",
    url: "https://docker-curriculum.com/",
    thumbnail: "https://docker-curriculum.com/images/docker.png",
    type: "course",
    skill: "Docker",
    level: "Beginner",
    duration: "2 hours",
    description: "A hands-on tutorial for getting started with Docker for web developers."
  },
  // AWS
  {
    title: "AWS Certified Cloud Practitioner Training Course",
    provider: "freeCodeCamp.org (YouTube)",
    url: "https://www.youtube.com/watch?v=3hLmDS179YE",
    thumbnail: "https://img.youtube.com/vi/3hLmDS179YE/mqdefault.jpg",
    type: "video",
    skill: "Amazon Web Services",
    level: "Beginner",
    duration: "13 hours",
    description: "Complete preparation for AWS Cloud Practitioner certification covering EC2, S3, RDS, and IAM."
  },
  {
    title: "AWS Cloud Essentials for Beginners",
    provider: "AWS Training & Certification",
    url: "https://aws.amazon.com/getting-started/",
    thumbnail: "https://a0.awsstatic.com/main/images/logos/aws_logo_smile_1200x630.png",
    type: "course",
    skill: "Amazon Web Services",
    level: "Beginner",
    duration: "3 hours",
    description: "Official AWS getting started hands-on tutorials and labs."
  },
  // React
  {
    title: "React Course - Beginner's Tutorial for React JavaScript Library",
    provider: "freeCodeCamp.org (YouTube)",
    url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/mqdefault.jpg",
    type: "video",
    skill: "React",
    level: "Beginner",
    duration: "12 hours",
    description: "Build interactive web apps using React state, props, hooks, and context."
  },
  // Node.js
  {
    title: "Node.js and Express.js Full Course",
    provider: "freeCodeCamp.org (YouTube)",
    url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/mqdefault.jpg",
    type: "video",
    skill: "Node.js",
    level: "Beginner",
    duration: "8 hours",
    description: "Learn Node.js core modules, Express framework, middleware, and API building."
  },
  // Microservices
  {
    title: "Microservices Architecture and Design Patterns",
    provider: "freeCodeCamp.org (YouTube)",
    url: "https://www.youtube.com/watch?v=CdBtNQHg8aU",
    thumbnail: "https://img.youtube.com/vi/CdBtNQHg8aU/mqdefault.jpg",
    type: "video",
    skill: "Microservices",
    level: "Intermediate",
    duration: "2 hours",
    description: "Learn key microservices architecture concepts, API gateways, and distributed tracing."
  },
  // MongoDB
  {
    title: "MongoDB Complete Crash Course",
    provider: "Traversy Media (YouTube)",
    url: "https://www.youtube.com/watch?v=-56x56UppqQ",
    thumbnail: "https://img.youtube.com/vi/-56x56UppqQ/mqdefault.jpg",
    type: "video",
    skill: "MongoDB",
    level: "Beginner",
    duration: "1.5 hours",
    description: "Learn MongoDB collections, CRUD operations, indexing, and Mongoose ORM."
  }
];

class CuratedProvider {
  async getResources(skill) {
    if (!skill) return [];
    const skillLower = skill.toLowerCase();
    
    // Filter matching resources
    const matches = CURATED_RESOURCES.filter(r => 
      r.skill.toLowerCase().includes(skillLower) || 
      skillLower.includes(r.skill.toLowerCase()) ||
      (skillLower.includes('aws') && r.skill.includes('Amazon')) ||
      (skillLower.includes('spring') && r.skill.includes('Spring'))
    );

    if (matches.length > 0) return matches;

    // Fallback search match by title keywords
    return CURATED_RESOURCES.filter(r => r.title.toLowerCase().includes(skillLower));
  }
}

module.exports = CuratedProvider;
