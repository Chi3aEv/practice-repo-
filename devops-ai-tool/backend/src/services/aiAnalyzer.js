const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeLogs(logs) {
  const prompt = `You are a DevOps observability expert. Analyze the following logs and provide:
1. A summary of what happened
2. Any errors or anomalies detected
3. Root cause analysis if errors exist
4. Recommended actions

Logs:
${logs}

Respond in JSON format: { "summary": "", "anomalies": [], "rootCause": "", "recommendations": [] }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function summarizeAlert(alert) {
  const prompt = `You are a DevOps engineer. Summarize this alert in plain English and suggest immediate actions:
Alert: ${JSON.stringify(alert)}
Respond in JSON: { "summary": "", "severity": "low|medium|high|critical", "immediateActions": [] }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyzeLogs, summarizeAlert };
