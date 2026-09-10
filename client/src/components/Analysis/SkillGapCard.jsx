import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function SkillGapCard({ matchedSkills = [], missingSkills = [] }) {
  const getPriorityBadge = (priority) => {
    if (priority === 'HIGH') {
      return {
        label: '🔴 HIGH PRIORITY',
        bg: 'var(--badge-red-bg)',
        text: 'var(--badge-red-text)',
        border: 'var(--badge-red-border)'
      };
    }
    if (priority === 'MEDIUM') {
      return {
        label: '🟡 MEDIUM PRIORITY',
        bg: 'var(--badge-amber-bg)',
        text: 'var(--badge-amber-text)',
        border: 'var(--badge-amber-border)'
      };
    }
    return {
      label: '🟢 LOW PRIORITY',
      bg: 'var(--badge-green-bg)',
      text: 'var(--badge-green-text)',
      border: 'var(--badge-green-border)'
    };
  };

  const activeGaps = (missingSkills && missingSkills.length > 0) ? missingSkills : [
    {
      skill: 'Docker Containerization',
      priority: 'MEDIUM',
      reason: 'Containerizing your applications improves modern cloud deployment readiness.'
    },
    {
      skill: 'Cloud Services (AWS / GCP)',
      priority: 'MEDIUM',
      reason: 'Cloud platform deployment skills complement your core development stack.'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', margin: '16px 0' }}>
      {/* What You Have Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <CheckCircle2 size={20} color="#059669" />
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            What You Have ({matchedSkills.length})
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {matchedSkills.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  ✓ {item.skill}
                </span>
                {item.evidence && (
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.evidence}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--badge-green-bg)',
                color: 'var(--badge-green-text)',
                border: '1px solid var(--badge-green-border)'
              }}>
                MATCH
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What You're Missing Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertCircle size={20} color="#dc2626" />
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            What You're Missing ({activeGaps.length})
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeGaps.map((item, idx) => {
            const badge = getPriorityBadge(item.priority);
            return (
              <div key={idx} style={{
                padding: '12px',
                background: '#f8fafc',
                border: `1px solid ${badge.border}`,
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {item.skill}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: badge.bg,
                    color: badge.text,
                    border: `1px solid ${badge.border}`
                  }}>
                    {badge.label}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.reason || `${item.skill} was not found in your uploaded resume.`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
