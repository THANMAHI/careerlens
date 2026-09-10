import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ScoreBreakdownChart({ breakdown }) {
  if (!breakdown) return null;

  const data = [
    { name: 'Skills', score: breakdown.skills?.weighted || 0, max: 35 },
    { name: 'Keywords', score: breakdown.keywords?.weighted || 0, max: 20 },
    { name: 'Experience', score: breakdown.experience?.weighted || 0, max: 20 },
    { name: 'Education', score: breakdown.education?.weighted || 0, max: 10 },
    { name: 'Structure', score: breakdown.structure?.weighted || 0, max: 10 },
    { name: 'Certs', score: breakdown.certifications?.weighted || 0, max: 5 }
  ];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      margin: '16px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
        ATS Weighted Score Category Breakdown
      </h4>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
            <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
            <Tooltip
              formatter={(value, name, props) => [`${value} / ${props.payload.max} pts`, 'Score']}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
