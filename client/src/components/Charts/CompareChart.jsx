import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CompareChart({ resumes = [] }) {
  if (!resumes || resumes.length === 0) return null;

  const data = resumes.map(r => ({
    name: r.name.length > 18 ? r.name.substring(0, 15) + '...' : r.name,
    'ATS Score': r.atsScore,
    'Job Readiness': r.jobReadinessScore || r.atsScore
  }));

  return (
    <div style={{ width: '100%', height: 240, marginTop: '16px' }}>
      <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
        Comparative ATS & Readiness Performance
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#475569' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="ATS Score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Job Readiness" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
