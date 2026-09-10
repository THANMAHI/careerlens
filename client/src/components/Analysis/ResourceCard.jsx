import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

const FALLBACK_RESOURCES = {
  "Spring Boot": [
    {
      title: "Spring Boot Full Course - Learn Spring Boot 3 in 4 Hours",
      provider: "freeCodeCamp.org (YouTube)",
      url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
      thumbnail: "https://img.youtube.com/vi/9SGDpanrc8U/mqdefault.jpg",
      type: "video",
      level: "Beginner",
      duration: "4 hours"
    },
    {
      title: "Building REST services with Spring",
      provider: "Spring.io Guides",
      url: "https://spring.io/guides/tutorials/rest/",
      thumbnail: "https://spring.io/images/og-spring.png",
      type: "article",
      level: "Beginner",
      duration: "1 hour"
    }
  ],
  "Docker": [
    {
      title: "Docker Tutorial for Beginners - Full Course",
      provider: "TechWorld with Nana (YouTube)",
      url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      thumbnail: "https://img.youtube.com/vi/3c-iBn73dDE/mqdefault.jpg",
      type: "video",
      level: "Beginner",
      duration: "3 hours"
    }
  ]
};

export default function ResourceCard({ resourcesMap = {} }) {
  const activeResources = (resourcesMap && Object.keys(resourcesMap).length > 0) 
    ? resourcesMap 
    : FALLBACK_RESOURCES;

  const skills = Object.keys(activeResources);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      margin: '16px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <BookOpen size={20} color="var(--accent-primary)" />
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Recommended Learning Resources & Video Courses
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Curated courses and video tutorials to close missing skill gaps and boost job readiness.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {skills.map(skill => {
          const list = activeResources[skill] || [];
          if (!list || list.length === 0) return null;

          return (
            <div key={skill}>
              <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                Learn {skill}
              </h5>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px'
              }}>
                {list.map((item, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    {item.thumbnail ? (
                      <div style={{ position: 'relative', width: '100%', height: '110px', backgroundColor: '#0f172a' }}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          color: '#ffffff',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          {item.type || 'Resource'}
                        </div>
                      </div>
                    ) : null}

                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                          {item.provider}
                        </span>
                        <h6 style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          margin: '4px 0 6px 0',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.title}
                        </h6>
                      </div>

                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {item.level || 'Beginner'} • {item.duration || 'Tutorial'}
                        </span>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--accent-primary)'
                          }}
                        >
                          Watch / View <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
