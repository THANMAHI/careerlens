import React from 'react';
import { User, Sparkles } from 'lucide-react';
import ScoreRing from '../Analysis/ScoreRing';
import SkillGapCard from '../Analysis/SkillGapCard';
import ResumeHealthCard from '../Analysis/ResumeHealthCard';
import RoadmapCard from '../Analysis/RoadmapCard';
import ResourceCard from '../Analysis/ResourceCard';
import ComparisonCard from '../Analysis/ComparisonCard';
import ScoreBreakdownChart from '../Charts/ScoreBreakdownChart';

export default function ChatMessage({ message }) {
  if (!message) return null;
  const isUser = message.role === 'user';
  const data = message.analysisData;

  // Markdown formatter helper for headings, bold, bullet lists, and line breaks
  const formatContent = (text) => {
    if (!text) return null;
    let formatted = String(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h4 style="font-size:15px; font-weight:700; margin:14px 0 6px 0; color:var(--text-primary);">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="font-size:16px; font-weight:800; margin:16px 0 8px 0; color:var(--text-primary);">$1</h3>')
      .replace(/^- (.*$)/gim, '<li style="margin-left:16px; margin-bottom:4px;">$1</li>');

    return (
      <div
        dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }}
        style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}
      />
    );
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexDirection: isUser ? 'row-reverse' : 'row'
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: isUser ? '#e2e8f0' : 'var(--accent-primary)',
        color: isUser ? 'var(--text-primary)' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontWeight: '700',
        fontSize: '14px'
      }}>
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>

      {/* Bubble Content */}
      <div style={{ maxWidth: isUser ? '75%' : '92%', width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
          justifyContent: isUser ? 'flex-end' : 'flex-start'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {isUser ? 'You' : 'CareerLens AI Advisor'}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>

        <div style={{
          background: isUser ? 'var(--accent-light)' : '#ffffff',
          border: isUser ? '1px solid #c7d2fe' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {formatContent(message.content)}

          {/* Render Full Ordered AI Analysis Cards inline */}
          {message.isInitialAnalysis && data && (
            <div style={{ marginTop: '20px' }}>
              {/* 1. Score Ring Overview */}
              <ScoreRing
                score={data.atsScore}
                matchLevel={data.matchLevel}
                jobReadinessScore={data.jobReadinessScore}
                breakdown={data.breakdown}
              />

              {/* 2. Category Breakdown Chart */}
              {data.breakdown && (
                <ScoreBreakdownChart breakdown={data.breakdown} />
              )}

              {/* 3. What You Have vs What You're Missing */}
              <SkillGapCard
                matchedSkills={data.matchedSkills || []}
                missingSkills={data.missingSkills || []}
              />

              {/* 4. Multiple Resume Comparison (if multiple uploaded) */}
              {data.resumes && data.resumes.length > 1 && (
                <ComparisonCard
                  resumes={data.resumes}
                  bestExplanation={data.bestResumeExplanation}
                />
              )}

              {/* 5. Resume Health Audit & Recommendations */}
              <ResumeHealthCard
                structureEval={data.structureEval || {}}
                recommendations={data.recommendations || []}
              />

              {/* 6. Step-by-step Personalized Learning Roadmap */}
              <RoadmapCard roadmap={data.learningRoadmap || []} />

              {/* 7. Curated Video & Course Resources */}
              {data.resources && Object.keys(data.resources).length > 0 && (
                <ResourceCard resourcesMap={data.resources} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
