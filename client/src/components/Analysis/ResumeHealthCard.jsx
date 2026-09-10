import React from 'react';
import { Activity, Sparkles, CheckCircle } from 'lucide-react';

export default function ResumeHealthCard({ structureEval = {}, recommendations = [] }) {
  const healthItems = structureEval.healthItems || [
    { category: "Structure", score: 8, feedback: "Standard readable section formatting." },
    { category: "Readability", score: 9, feedback: "Clean layout and legible typography." },
    { category: "Keywords", score: 7, feedback: "Sufficient core keyword density." },
    { category: "Achievements", score: 6, feedback: "Bullets emphasize tasks over quantifiable metrics." },
    { category: "ATS Compatibility", score: 8, feedback: "Compatible text structure." }
  ];

  // Guaranteed recommendations list
  const activeRecommendations = (recommendations && recommendations.length > 0) ? recommendations : [
    {
      title: "Quantify Project Outcomes",
      priority: "HIGH",
      action: "Add measurable result metrics (e.g. latency reduced by 30%, 10k+ active users, query performance optimized) to your top project bullet points."
    },
    {
      title: "Highlight Core Technology Terminology",
      priority: "HIGH",
      action: "Ensure exact skill keywords listed in the job description appear clearly in both your Skills section and project descriptions."
    },
    {
      title: "Add Live Project Links",
      priority: "MEDIUM",
      action: "Include working GitHub repository links and deployed live demo URLs for your featured software projects."
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', margin: '16px 0' }}>
      {/* Resume Health Breakdown */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={20} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Resume Health Assessment
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {healthItems.map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                <span>{item.category}</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{item.score}/10</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  width: `${item.score * 10}%`,
                  height: '100%',
                  background: item.score >= 8 ? '#10b981' : (item.score >= 6 ? '#4f46e5' : '#f59e0b'),
                  borderRadius: '99px'
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                {item.feedback}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={20} color="#f59e0b" />
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            High-Impact Recommendations
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeRecommendations.map((rec, idx) => (
            <div key={idx} style={{
              padding: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {rec.title}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '99px',
                  backgroundColor: rec.priority === 'HIGH' ? 'var(--badge-red-bg)' : 'var(--badge-amber-bg)',
                  color: rec.priority === 'HIGH' ? 'var(--badge-red-text)' : 'var(--badge-amber-text)'
                }}>
                  {rec.priority}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {rec.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
