import React from 'react';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ChatArea from './components/Chat/ChatArea';
import UploadModal from './components/Upload/UploadModal';

function MainLayout() {
  const { error } = useAnalysis();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        {error && (
          <div style={{
            padding: '10px 16px',
            backgroundColor: 'var(--badge-red-bg)',
            color: 'var(--badge-red-text)',
            borderBottom: '1px solid var(--badge-red-border)',
            fontSize: '13px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}
        <ChatArea />
      </div>
      <UploadModal />
    </div>
  );
}

export default function App() {
  return (
    <AnalysisProvider>
      <MainLayout />
    </AnalysisProvider>
  );
}
