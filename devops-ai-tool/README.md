# 🤖 DevOps AI Tool — Observability & Log Analysis

An AI-powered tool for DevOps engineers to analyze logs, monitor metrics, and triage alerts using OpenAI GPT.

## Features
- **Log Analyzer** — Paste or upload logs, get AI-powered root cause analysis & recommendations
- **Metrics Dashboard** — Ingest and visualize CPU, memory, and error rate metrics
- **Alerts Panel** — Submit alerts and get AI-generated severity classification & immediate actions

## Project Structure
```
devops-ai-tool/
├── backend/
│   ├── src/
│   │   ├── routes/        # logs, metrics, alerts API routes
│   │   ├── services/      # aiAnalyzer, logParser
│   │   ├── utils/         # logger
│   │   ├── tests/         # Jest tests
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # LogAnalyzer, MetricsDashboard, AlertsPanel
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── .env.example
```

## Quick Start

### 1. Set your OpenAI API key
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### 3. Run locally (without Docker)
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/logs/analyze | AI analyze raw logs |
| POST | /api/logs/upload | Upload & analyze log file |
| POST | /api/logs/parse | Parse logs without AI |
| POST | /api/metrics | Ingest a metric |
| GET | /api/metrics | Get all metrics |
| GET | /api/metrics/summary | Get per-service summary |
| POST | /api/alerts | Submit alert for AI triage |
| GET | /api/alerts | Get all alerts |
| DELETE | /api/alerts/:id | Dismiss an alert |
