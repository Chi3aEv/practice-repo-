const express = require('express');
const multer = require('multer');
const { parseLogs } = require('../services/logParser');
const { analyzeLogs } = require('../services/aiAnalyzer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/logs/analyze - analyze raw log text
router.post('/analyze', async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs) return res.status(400).json({ error: 'logs field is required' });

    const parsed = parseLogs(logs);
    const analysis = await analyzeLogs(logs);

    res.json({ parsed, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/logs/upload - upload a log file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const logs = req.file.buffer.toString('utf-8');
    const parsed = parseLogs(logs);
    const analysis = await analyzeLogs(logs.slice(0, 8000)); // limit tokens

    res.json({ filename: req.file.originalname, parsed, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/logs/parse - parse only without AI
router.post('/parse', (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs) return res.status(400).json({ error: 'logs field is required' });
    res.json(parseLogs(logs));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
