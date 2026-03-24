import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({ service: '', cpu: '', memory: '', errorRate: '' });

  const fetchData = async () => {
    try {
      const [m, s] = await Promise.all([
        axios.get(`${API}/api/metrics`),
        axios.get(`${API}/api/metrics/summary`),
      ]);
      setMetrics(m.data.metrics);
      setSummary(Array.isArray(s.data) ? s.data : []);
    } catch {
      toast.error('Failed to fetch metrics');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/metrics`, {
        ...form,
        cpu: Number(form.cpu),
        memory: Number(form.memory),
        errorRate: Number(form.errorRate),
      });
      toast.success('Metric ingested!');
      setForm({ service: '', cpu: '', memory: '', errorRate: '' });
      fetchData();
    } catch {
      toast.error('Failed to ingest metric');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">📊 Ingest Metric</h2>
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          {['service', 'cpu', 'memory', 'errorRate'].map(field => (
            <input
              key={field}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-medium">
            Submit Metric
          </button>
        </form>
      </div>

      {summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.map(s => (
            <div key={s.service} className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-blue-300 mb-2">{s.service}</h3>
              <p className="text-slate-400 text-sm">CPU: <span className="text-white">{s.avgCpu}%</span></p>
              <p className="text-slate-400 text-sm">Memory: <span className="text-white">{s.avgMemory}%</span></p>
              <p className="text-slate-400 text-sm">Error Rate: <span className="text-red-400">{s.avgErrorRate}%</span></p>
            </div>
          ))}
        </div>
      )}

      {metrics.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">📈 CPU & Memory Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.slice(-50)}>
              <XAxis dataKey="timestamp" hide />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#60a5fa" dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#34d399" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
