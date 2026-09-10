import React, { useEffect, useRef } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ComparisonCard from '../Analysis/ComparisonCard';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function ChatArea() {
  const { messages, activeAnalysis, currentView, setUploadModalOpen, runDemo } = useAnalysis();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If in Multi-Resume Comparison View tab
  if (currentView === 'compare' && activeAnalysis?.resumes) {
    return (
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <ComparisonCard
          resumes={activeAnalysis.resumes}
          bestExplanation={activeAnalysis.bestResumeExplanation}
        />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {messages.length === 0 ? (
            /* Empty Landing State */
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              maxWidth: '560px',
              margin: '40px auto 0 auto'
            }} className="animate-fade-in">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Sparkles size={32} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Let's make your resume job-ready.
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
                Upload your resume and a target job description. I'll show you where you match, where you're missing, and exactly what to improve.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={runDemo}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={18} color="#f59e0b" />
                  Try Instant Demo
                </button>

                <button
                  onClick={() => setUploadModalOpen(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <UploadCloud size={18} />
                  Start Analysis
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Composer */}
      <ChatInput />
    </div>
  );
}
