import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export default function UploadModal() {
  const { uploadModalOpen, setUploadModalOpen, analyzeResumes, isAnalyzing, runDemo } = useAnalysis();
  const [files, setFiles] = useState([]);
  const [jdText, setJdText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!uploadModalOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles) => {
    setValidationError('');
    const valid = newFiles.filter(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return ['.pdf', '.docx', '.doc', '.txt'].includes(ext);
    });

    if (valid.length !== newFiles.length) {
      setValidationError('Some files were skipped. Only PDF, DOCX, and TXT formats are supported.');
    }

    if (files.length + valid.length > 5) {
      setValidationError('Maximum 5 resumes allowed per comparison session.');
      setFiles(prev => [...prev, ...valid].slice(0, 5));
    } else {
      setFiles(prev => [...prev, ...valid]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setValidationError('Please upload at least one resume file.');
      return;
    }
    if (!jdText.trim()) {
      setValidationError('Please paste or upload a Job Description.');
      return;
    }
    analyzeResumes(files, jdText);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column'
      }} className="animate-fade-in">
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
              New Resume & Job Analysis
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Upload your resume(s) and paste the Job Description to calculate your match score.
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(false)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {validationError && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'var(--badge-red-bg)',
              border: '1px solid var(--badge-red-border)',
              color: 'var(--badge-red-text)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              {validationError}
            </div>
          )}

          {/* 1. Resume Upload Dropzone */}
          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              1. Upload Resumes (PDF, DOCX, TXT - Up to 5 files)
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-primary)' : '#cbd5e1'}`,
                backgroundColor: dragActive ? 'var(--accent-light)' : '#f8fafc',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <UploadCloud size={32} color="var(--accent-primary)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Click to browse or drag & drop files here
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Supports PDF, DOCX, and TXT resumes (Max 10MB per file)
              </span>
              <input
                id="file-upload-input"
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Uploaded File Chips */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {files.map((file, idx) => (
                  <div key={idx} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    <FileText size={14} color="var(--accent-primary)" />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Job Description Textarea */}
          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              2. Job Description
            </label>
            <textarea
              rows={6}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the target job description requirements here (e.g. required skills, responsibilities, years of experience)..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontFamily: 'inherit',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Progress loader if analyzing */}
          {isAnalyzing && (
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--accent-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #c7d2fe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="animate-pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  Analyzing application...
                </span>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>✓ Extracting text from uploaded resume(s)</li>
                <li>✓ Parsing skills and job requirements</li>
                <li>✓ Semantic skill normalization (Java vs JS guard)</li>
                <li>◌ Computing deterministic ATS match score</li>
                <li>◌ Prioritizing skill gaps & building learning roadmap</li>
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => { setUploadModalOpen(false); runDemo(); }}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={16} color="#f59e0b" />
              Try Demo Sample
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnalyzing}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isAnalyzing ? 0.7 : 1
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze My Resume'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
