import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import QuickActions from './QuickActions';

export default function ChatInput() {
  const { sendMessage, isSending } = useAnalysis();
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div style={{
      padding: '16px 24px 20px 24px',
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto'
    }}>
      <QuickActions />

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        background: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CareerLens AI anything about your resume, missing skills, or roadmap..."
          disabled={isSending}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            color: 'var(--text-primary)',
            maxHeight: '120px'
          }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          style={{
            border: 'none',
            backgroundColor: input.trim() && !isSending ? 'var(--accent-primary)' : '#cbd5e1',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
            marginLeft: '8px'
          }}
        >
          {isSending ? <Loader2 size={16} className="animate-pulse" /> : <Send size={16} />}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
        <span>Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for line break</span>
        <span>Context Active: Resume & Job Description</span>
      </div>
    </div>
  );
}
