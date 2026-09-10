import React from 'react';
import { Menu, Plus, Sparkles, Layers, MessageSquare } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export default function Header() {
  const { activeAnalysis, setUploadModalOpen, setSidebarOpen, currentView, setCurrentView, runDemo } = useAnalysis();

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10
    }}>
      {/* Left Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {activeAnalysis ? activeAnalysis.title : 'CareerLens AI Workspace'}
            </h2>
            {activeAnalysis && (
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)'
              }}>
                {activeAnalysis.atsScore}/100 ATS Match
              </span>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Talk to your resume. Understand your gaps. Get job-ready.
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Navigation Tabs */}
        {activeAnalysis && (
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setCurrentView('chat')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: currentView === 'chat' ? '#ffffff' : 'transparent',
                color: currentView === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: currentView === 'chat' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <MessageSquare size={14} /> Chat Workspace
            </button>
            {activeAnalysis.resumes && activeAnalysis.resumes.length > 1 && (
              <button
                onClick={() => setCurrentView('compare')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: currentView === 'compare' ? '#ffffff' : 'transparent',
                  color: currentView === 'compare' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: currentView === 'compare' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Layers size={14} /> Compare Resumes
              </button>
            )}
          </div>
        )}

        <button
          onClick={runDemo}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={16} color="#f59e0b" />
          Try Demo
        </button>

        <button
          onClick={() => setUploadModalOpen(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={16} />
          New Analysis
        </button>
      </div>
    </header>
  );
}
