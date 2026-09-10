const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text from uploaded resume file (PDF, DOCX, TXT)
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Extracted text content
 */
async function extractTextFromFile(file) {
  const filePath = file.path;
  const ext = path.extname(file.originalname).toLowerCase();
  let text = '';

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text || '';
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value || '';
    } else if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error(`Unsupported file extension: ${ext}`);
    }

    // Clean text: normalize whitespace & newlines
    text = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

    if (!text || text.trim().length === 0) {
      throw new Error(`No readable text could be extracted from ${file.originalname}. The file may be empty or an unreadable scanned image.`);
    }

    return text;
  } catch (err) {
    console.error(`Error extracting text from ${file.originalname}:`, err.message);
    throw new Error(`Failed to parse ${file.originalname}: ${err.message}`);
  } finally {
    // Clean up temp file
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn('Failed to delete temp file:', filePath);
      }
    }
  }
}

module.exports = { extractTextFromFile };
