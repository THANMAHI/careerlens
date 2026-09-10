import React from 'react';
import { Award, Zap } from 'lucide-react';

export default function ScoreRing({ score = 82, matchLevel = "Strong Match", jobReadinessScore = 74, breakdown }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 85) return '#10b981'; // Green
    if (val >= 70) return '#4f46e5'; // Primary Indigo
    if (val >= 55) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      margin: '16px 0'
    }}>
      {/* ATS Score Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>
              / 100
            </span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Award size={18} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              ATS Match Score
            </h4>
          </div>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: '700',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            marginBottom: '10px'
          }}>
            {matchLevel}
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Deterministic score computed across 6 weighted categories.
          </p>
        </div>
      </div>

      {/* Job Readiness Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={18} color="#f59e0b" />
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Job Readiness
            </h4>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', color: getScoreColor(jobReadinessScore) }}>
            {jobReadinessScore}%
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{
            width: `${jobReadinessScore}%`,
            height: '100%',
            background: getScoreColor(jobReadinessScore),
            borderRadius: '99px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          CareerLens metric reflecting skill coverage, critical gaps, and learning readiness.
        </p>
      </div>
    </div>
  );
}
