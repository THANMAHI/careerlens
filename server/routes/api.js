const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyzeApplication } = require('../services/analysisEngine');
const llmService = require('../services/llmService');
const resourceManager = require('../services/courseProviders/resourceManager');
const { DEMO_ANALYSIS_RESULT } = require('../services/demoData');
const { saveAnalysis, getAnalysisById, updateChatHistory } = require('../models/Analysis');

/**
 * POST /api/demo
 * Trigger instant demo mode with deterministic dataset
 */
router.post('/demo', async (req, res) => {
  try {
    const demoData = { ...DEMO_ANALYSIS_RESULT, id: `demo-${Date.now()}` };
    const resources = await resourceManager.getResourcesForMissingSkills(demoData.missingSkills);
    demoData.resources = resources;
    await saveAnalysis(demoData);
    return res.json({ success: true, data: demoData });
  } catch (err) {
    console.error('Demo endpoint error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/analyze
 * Single or multi-resume file upload + JD text analysis
 */
router.post('/analyze', upload.array('resumes', 5), async (req, res) => {
  try {
    const files = req.files || [];
    const jdText = req.body.jobDescription || '';

    if (files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please upload at least one valid PDF, DOCX, or TXT resume file.' });
    }

    if (!jdText.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter or upload a Job Description to compare against.' });
    }

    const result = await analyzeApplication(files, jdText);
    await saveAnalysis(result);

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({ success: false, error: err.message || 'An error occurred during resume analysis.' });
  }
});

/**
 * POST /api/chat
 * Conversational endpoint maintaining full analysis context
 */
router.post('/chat', async (req, res) => {
  try {
    const { analysisId, message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    let analysisContext = DEMO_ANALYSIS_RESULT;
    if (analysisId) {
      const savedContext = await getAnalysisById(analysisId);
      if (savedContext) {
        analysisContext = savedContext;
      }
    }

    const response = await llmService.processChatMessage(message, analysisContext, conversationHistory);
    
    // Save message to chat history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response.reply, actionType: response.actionType, timestamp: new Date().toISOString() }
    ];

    if (analysisId) {
      await updateChatHistory(analysisId, updatedHistory);
    }

    return res.json({
      success: true,
      reply: response.reply,
      actionType: response.actionType,
      updatedHistory
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message with AI advisor.',
      reply: 'I experienced a brief connection issue. Please try asking your question again.'
    });
  }
});

/**
 * GET /api/resources
 * Aggregate learning resources for a missing skill
 */
router.get('/resources', async (req, res) => {
  try {
    const { skill, level = 'Beginner' } = req.query;
    if (!skill) {
      return res.status(400).json({ success: false, error: 'Skill query parameter is required.' });
    }

    const resources = await resourceManager.getResourcesForSkill(skill, level);
    return res.json({ success: true, skill, resources });
  } catch (err) {
    console.error('Resources endpoint error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/analysis/:id
 * Retrieve saved analysis by ID
 */
router.get('/analysis/:id', async (req, res) => {
  try {
    const data = await getAnalysisById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Analysis not found.' });
    }
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
