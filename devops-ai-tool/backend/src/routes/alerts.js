const express = require('express');
const { summarizeAlert } = require('../services/aiAnalyzer');
const router = express.Router();

let alertsStore = [];

// POST /api/alerts - ingest and AI-summarize an alert
router.post('/', async (req, res) => {
  try {
    const alert = req.body;
    if (!alert || !alert.name) return res.status(400).json({ error: 'alert name is required' });

    const aiSummary = await summarizeAlert(alert);
    const stored = { id: Date.now(), ...alert, aiSummary, receivedAt: new Date().toISOString() };
    alertsStore.push(stored);

    res.status(201).json(stored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alerts - get all alerts
router.get('/', (req, res) => {
  const { severity } = req.query;
  const data = severity ? alertsStore.filter(a => a.aiSummary?.severity === severity) : alertsStore;
  res.json({ count: data.length, alerts: data });
});

// DELETE /api/alerts/:id - dismiss alert
router.delete('/:id', (req, res) => {
  alertsStore = alertsStore.filter(a => a.id !== parseInt(req.params.id));
  res.json({ message: 'Alert dismissed' });
});

module.exports = router;
