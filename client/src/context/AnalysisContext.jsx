import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [pastAnalyses, setPastAnalyses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'compare'
  const [error, setError] = useState(null);

  // Explicit demo trigger
  const runDemo = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await axios.post('/api/demo');
      if (res.data.success) {
        const data = res.data.data;
        setActiveAnalysis(data);
        setPastAnalyses(prev => {
          if (prev.some(a => a.id === data.id)) return prev;
          return [data, ...prev];
        });
        
        const missingHigh = (data.missingSkills || []).filter(s => s.priority === 'HIGH').map(s => s.skill).join(', ');

        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `I completed analyzing your application for the **${data.jdTitle || 'Target Role'}** position.

### 📊 Executive Match Overview
- **Candidate**: ${data.candidateName || 'Candidate'}
- **ATS Match Score**: **${data.atsScore}/100** (${data.matchLevel})
- **Job Readiness Score**: **${data.jobReadinessScore}/100**

### 💡 Core Assessment Summary
Your resume shows strong foundational alignment in core skills like **${(data.matchedSkills || []).slice(0, 3).map(s => s.skill).join(', ')}**. However, your highest-priority gaps are **${missingHigh || 'Spring Boot and Docker'}**, which are explicitly requested in the job description. Below is your full breakdown, resume health audit, learning roadmap, and recommended resources.`,
            isInitialAnalysis: true,
            analysisData: data,
            timestamp: new Date().toISOString()
          }
        ]);
        setCurrentView('chat');
      }
    } catch (err) {
      console.error('Failed to run demo:', err);
      setError('Unable to initialize demo mode. Please try refreshing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResumes = async (files, jobDescription) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('resumes', file));
      formData.append('jobDescription', jobDescription);

      const res = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const data = res.data.data;
        setActiveAnalysis(data);
        setPastAnalyses(prev => [data, ...prev]);

        const isMulti = data.resumes && data.resumes.length > 1;

        let greetingContent = '';

        if (isMulti) {
          const rankingsText = data.resumes.map((r, idx) => {
            const badge = idx === 0 ? '🥇 #1' : (idx === 1 ? '🥈 #2' : (idx === 2 ? '🥉 #3' : `#${idx + 1}`));
            return `${badge} **${r.candidateName || r.name}** (${r.name}) — ATS Score: **${r.atsScore}/100** (${r.matchLevel}) ${r.isBest ? '• **BEST MATCH**' : ''}`;
          }).join('\n');

          greetingContent = `I completed analyzing **${data.resumes.length} candidate resumes** against the **${data.jdTitle || 'Job Description'}** requirements.

### 🏆 Candidate Comparative Rankings
${rankingsText}

### 💡 Winner Analysis
**${data.resumes[0].candidateName || data.resumes[0].name}** ranked **#1** with an ATS score of **${data.resumes[0].atsScore}/100** because they demonstrated higher required-skill coverage and keyword alignment compared to ${data.resumes.slice(1).map(r => r.candidateName || r.name).join(', ')}.

Review the comparative chart, candidate breakdown, and individual skill analysis below!`;
        } else {
          const missingHigh = (data.missingSkills || []).filter(s => s.priority === 'HIGH').map(s => s.skill).join(', ');
          const matchedTop = (data.matchedSkills || []).slice(0, 3).map(s => s.skill).join(', ');

          greetingContent = `I completed analyzing your resume against the **${data.jdTitle || 'Job Description'}** requirements.

### 📊 Executive Match Overview
- **Candidate Name**: ${data.candidateName || 'Candidate'}
- **ATS Match Score**: **${data.atsScore}/100** (${data.matchLevel})
- **Job Readiness Score**: **${data.jobReadinessScore}/100**

### 💡 Core Assessment Summary
Your resume demonstrates solid background in **${matchedTop || 'your technical skills'}**. 
${missingHigh ? `Your highest-priority technical gap(s) to address are: **${missingHigh}**.` : 'You satisfied the major required skills listed in the job description.'}

Below is your complete breakdown listing what you have, what you're missing, resume health audit, personalized roadmap, and curated video courses. Feel free to ask me any questions!`;
        }

        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: greetingContent,
            isInitialAnalysis: true,
            analysisData: data,
            timestamp: new Date().toISOString()
          }
        ]);
        setUploadModalOpen(false);
        setCurrentView('chat');
      } else {
        setError(res.data.error || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error('Analyze error:', err);
      setError(err.response?.data?.error || 'An error occurred during resume analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessage = async (userPrompt) => {
    if (!userPrompt || !userPrompt.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await axios.post('/api/chat', {
        analysisId: activeAnalysis?.id,
        message: userPrompt,
        conversationHistory: messages
      });

      if (res.data.success) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.data.reply,
          actionType: res.data.actionType,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble connecting to the response engine. Please try asking again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const selectAnalysis = (analysis) => {
    setActiveAnalysis(analysis);
    const isMulti = analysis.resumes && analysis.resumes.length > 1;

    let contentStr = '';
    if (isMulti) {
      const rankingsText = analysis.resumes.map((r, idx) => {
        const badge = idx === 0 ? '🥇 #1' : (idx === 1 ? '🥈 #2' : (idx === 2 ? '🥉 #3' : `#${idx + 1}`));
        return `${badge} **${r.candidateName || r.name}** (${r.name}) — ATS Score: **${r.atsScore}/100** (${r.matchLevel}) ${r.isBest ? '• **BEST MATCH**' : ''}`;
      }).join('\n');

      contentStr = `Loaded comparative analysis for **${analysis.resumes.length} candidates** against **${analysis.jdTitle || analysis.title}**.

### 🏆 Candidate Comparative Rankings
${rankingsText}`;
    } else {
      contentStr = `Loaded analysis for **${analysis.jdTitle || analysis.title}**.

### 📊 Executive Match Overview
- **Candidate Name**: ${analysis.candidateName || 'Candidate'}
- **ATS Match Score**: **${analysis.atsScore}/100** (${analysis.matchLevel})
- **Job Readiness Score**: **${analysis.jobReadinessScore}/100**`;
    }

    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: contentStr,
        isInitialAnalysis: true,
        analysisData: analysis,
        timestamp: new Date().toISOString()
      }
    ]);
    setCurrentView('chat');
  };

  const resetWorkspace = () => {
    setActiveAnalysis(null);
    setMessages([]);
    setCurrentView('chat');
  };

  return (
    <AnalysisContext.Provider
      value={{
        activeAnalysis,
        pastAnalyses,
        messages,
        isAnalyzing,
        isSending,
        uploadModalOpen,
        setUploadModalOpen,
        sidebarOpen,
        setSidebarOpen,
        currentView,
        setCurrentView,
        error,
        setError,
        runDemo,
        analyzeResumes,
        sendMessage,
        selectAnalysis,
        resetWorkspace
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
