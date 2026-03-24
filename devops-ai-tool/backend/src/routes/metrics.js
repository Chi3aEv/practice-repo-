const express = require('express');
const router = express.Router();

// In-memory metrics store (replace with Prometheus/InfluxDB in production)
let metricsStore = [];

// POST /api/metrics - ingest metrics
router.post('/', (req, res) => {
  try {
    const { service, cpu, memory, requestCount, errorRate, timestamp } = req.body;
    if (!service) return res.status(400).json({ error: 'service field is required' });

    const metric = { service, cpu, memory, requestCount, errorRate, timestamp: timestamp || new Date().toISOString() };
    metricsStore.push(metric);
    if (metricsStore.length > 1000) metricsStore = metricsStore.slice(-1000);

    res.status(201).json({ message: 'Metric ingested', metric });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/metrics - get all metrics
router.get('/', (req, res) => {
  const { service } = req.query;
  const data = service ? metricsStore.filter(m => m.service === service) : metricsStore;
  res.json({ count: data.length, metrics: data });
});

// GET /api/metrics/summary - get aggregated summary
router.get('/summary', (req, res) => {
  if (!metricsStore.length) return res.json({ message: 'No metrics available' });

  const services = [...new Set(metricsStore.map(m => m.service))];
  const summary = services.map(service => {
    const data = metricsStore.filter(m => m.service === service);
    const avg = key => (data.reduce((s, m) => s + (m[key] || 0), 0) / data.length).toFixed(2);
    return { service, avgCpu: avg('cpu'), avgMemory: avg('memory'), avgErrorRate: avg('errorRate'), dataPoints: data.length };
  });

  res.json(summary);
});

module.exports = router;
