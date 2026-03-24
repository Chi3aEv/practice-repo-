const request = require('supertest');
const app = require('../server');
const http = require('http');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen(0);
});

afterAll(async () => {
  await server.close();
});

describe('Health Check', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Log Parser - POST /api/logs/parse', () => {
  it('should parse logs and return counts', async () => {
    const logs = `2024-01-01 10:00:00 INFO Server started\n2024-01-01 10:01:00 ERROR Database connection failed`;
    const res = await request(app).post('/api/logs/parse').send({ logs });
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.errors).toBe(1);
  });

  it('should return 400 if logs field is missing', async () => {
    const res = await request(app).post('/api/logs/parse').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('Metrics - POST /api/metrics', () => {
  it('should ingest a metric', async () => {
    const res = await request(app).post('/api/metrics').send({ service: 'api', cpu: 45, memory: 60 });
    expect(res.statusCode).toBe(201);
    expect(res.body.metric.service).toBe('api');
  });
});
