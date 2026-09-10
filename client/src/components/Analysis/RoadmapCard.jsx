import React from 'react';
import { Compass, CheckCircle } from 'lucide-react';

export default function RoadmapCard({ roadmap = [] }) {
  if (!roadmap || roadmap.length === 0) return null;

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
        <Compass size={20} color="var(--accent-primary)" />
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Personalized Learning Roadmap
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Action plan tailored to close your specific job description skill gaps.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
        {roadmap.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{
              minWidth: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '14px'
            }}>
              {item.step || idx + 1}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  backgroundColor: '#e2e8f0',
                  color: 'var(--text-secondary)'
                }}>
                  {item.duration || `Week ${idx + 1}`}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                Skill Focus: {item.skill}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
