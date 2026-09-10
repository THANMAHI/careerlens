import React from 'react';
import { Layers, Trophy, CheckCircle, XCircle } from 'lucide-react';
import CompareChart from '../Charts/CompareChart';

export default function ComparisonCard({ resumes = [], bestExplanation }) {
  if (!resumes || resumes.length <= 1) return null;

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
        <Layers size={20} color="var(--accent-primary)" />
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Multiple Resume Comparison ({resumes.length} Resumes)
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Comparative ranking based on job description alignment and ATS scoring.
          </p>
        </div>
      </div>

      {/* Best Resume Highlight Banner */}
      {bestExplanation && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--accent-light)',
          border: '1px solid #c7d2fe',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Trophy size={20} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Top Recommendation
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
              {bestExplanation}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Rank</th>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Resume File</th>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Candidate</th>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>ATS Score</th>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Readiness</th>
              <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Skills Matched</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((r, idx) => (
              <tr key={idx} style={{
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: r.isBest ? '#f0fdf4' : 'transparent'
              }}>
                <td style={{ padding: '10px', fontWeight: '800' }}>
                  {idx === 0 ? <span style={{ color: '#059669' }}>🥇 #1</span> : `#${idx + 1}`}
                </td>
                <td style={{ padding: '10px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {r.name}
                  {r.isBest && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '99px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontWeight: '800'
                    }}>
                      BEST MATCH
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{r.candidateName || 'Candidate'}</td>
                <td style={{ padding: '10px', fontWeight: '800', color: r.atsScore >= 80 ? '#059669' : 'var(--accent-primary)' }}>
                  {r.atsScore}/100
                </td>
                <td style={{ padding: '10px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {r.jobReadinessScore || r.atsScore}%
                </td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  {r.matchedCount} matched / {r.missingCount} missing
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Recharts Visual */}
      <CompareChart resumes={resumes} />
    </div>
  );
}
