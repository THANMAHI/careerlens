import React from 'react';
import { Plus, FileText, Sparkles, Compass, MessageSquare, Award, ChevronRight } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export default function Sidebar() {
  const { pastAnalyses, activeAnalysis, selectAnalysis, setUploadModalOpen, sidebarOpen, runDemo } = useAnalysis();

  if (!sidebarOpen) return null;

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      zIndex: 20
    }}>
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '18px'
          }}>
            CL
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              CareerLens <span style={{ color: 'var(--accent-primary)' }}>AI</span>
            </h1>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              RESUME & JOB ADVISOR
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} />
          New Analysis
        </button>

        {/* Demo Button */}
        <button
          onClick={runDemo}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}
        >
          <Sparkles size={16} color="#f59e0b" />
          Try Sample Demo
        </button>

        {/* Past Analyses List */}
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'block',
            marginBottom: '10px',
            paddingLeft: '4px'
          }}>
            Recent Analyses
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '50vh', overflowY: 'auto' }}>
            {pastAnalyses.map((item) => {
              const isActive = activeAnalysis?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectAnalysis(item)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={16} style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      <span style={{ fontSize: '13px', fontWeight: isActive ? '700' : '600', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {item.jdTitle || item.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {item.candidateName}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '99px',
                    backgroundColor: isActive ? '#ffffff' : '#f1f5f9',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}>
                    {item.atsScore}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          CareerLens AI © 2026<br />
          Core Hackathon Engine • React + Node.js
        </p>
      </div>
    </aside>
  );
}
