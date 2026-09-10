import React from 'react';
import { HelpCircle, AlertCircle, Compass, Edit3, Layers, BookOpen } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export default function QuickActions() {
  const { sendMessage, isSending } = useAnalysis();

  const actions = [
    { label: 'Why this score?', icon: HelpCircle, prompt: 'Why did I get this match score? Break down my points.' },
    { label: 'What am I missing?', icon: AlertCircle, prompt: 'What are my top missing skills and technical gaps?' },
    { label: 'What should I learn first?', icon: Compass, prompt: 'Which missing skill should I learn first and why?' },
    { label: 'Improve my resume', icon: Edit3, prompt: 'How can I rewrite my project bullets to increase my ATS score?' },
    { label: 'Show learning roadmap', icon: BookOpen, prompt: 'Give me a 30-day learning plan tailored to my missing skills.' },
    { label: 'Compare resumes', icon: Layers, prompt: 'Compare my uploaded resumes and explain which version is best.' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '8px 0',
      marginBottom: '10px'
    }}>
      {actions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => sendMessage(item.prompt)}
            disabled={isSending}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isSending ? 'not-allowed' : 'pointer',
              opacity: isSending ? 0.6 : 1,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={14} color="var(--accent-primary)" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
