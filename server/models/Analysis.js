/**
 * In-Memory & Optional MongoDB Storage Adapter
 * Ensures zero-crash reliability if MongoDB is unconfigured or unavailable.
 */

const mongoose = require('mongoose');

// In-Memory Storage Map
const inMemoryStore = new Map();

// Optional Mongoose Schema
let AnalysisModel = null;
try {
  const analysisSchema = new mongoose.Schema({
    analysisId: { type: String, required: true, unique: true },
    title: String,
    jdTitle: String,
    candidateName: String,
    atsScore: Number,
    matchLevel: String,
    jobReadinessScore: Number,
    data: Object,
    chatHistory: Array,
    createdAt: { type: Date, default: Date.now }
  });
  AnalysisModel = mongoose.model('Analysis', analysisSchema);
} catch (err) {
  console.warn('Mongoose schema initialization skipped or already defined.');
}

async function saveAnalysis(analysisData) {
  const id = analysisData.id || `analysis-${Date.now()}`;
  inMemoryStore.set(id, { ...analysisData, chatHistory: analysisData.chatHistory || [] });

  if (mongoose.connection.readyState === 1 && AnalysisModel) {
    try {
      await AnalysisModel.findOneAndUpdate(
        { analysisId: id },
        { 
          analysisId: id,
          title: analysisData.title,
          jdTitle: analysisData.jdTitle,
          candidateName: analysisData.candidateName,
          atsScore: analysisData.atsScore,
          matchLevel: analysisData.matchLevel,
          jobReadinessScore: analysisData.jobReadinessScore,
          data: analysisData,
          chatHistory: analysisData.chatHistory || []
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('MongoDB save failed, using memory store:', err.message);
    }
  }

  return id;
}

async function getAnalysisById(id) {
  if (inMemoryStore.has(id)) {
    return inMemoryStore.get(id);
  }

  if (mongoose.connection.readyState === 1 && AnalysisModel) {
    try {
      const doc = await AnalysisModel.findOne({ analysisId: id });
      if (doc) return doc.data;
    } catch (err) {
      console.warn('MongoDB fetch failed:', err.message);
    }
  }

  return null;
}

async function updateChatHistory(id, newMessages) {
  const item = await getAnalysisById(id);
  if (item) {
    item.chatHistory = newMessages;
    inMemoryStore.set(id, item);

    if (mongoose.connection.readyState === 1 && AnalysisModel) {
      try {
        await AnalysisModel.findOneAndUpdate({ analysisId: id }, { chatHistory: newMessages });
      } catch (err) {
        console.warn('MongoDB update chat history failed:', err.message);
      }
    }
  }
}

module.exports = {
  saveAnalysis,
  getAnalysisById,
  updateChatHistory,
  inMemoryStore
};
