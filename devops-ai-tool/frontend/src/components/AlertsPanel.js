import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SEVERITY_COLORS = {
  critical: 'bg-red-900 border-red-500',
  high: 'bg-orange-900 border-orange-500',
  medium: 'bg-yellow-900 border-yellow-500',
  low: 'bg-slate-700 border-slate-500',
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ name: '', message: '', service: '' });

  const fetchAlerts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/alerts`);
      setAlerts(data.alerts);
    } catch {
      toast.error('Failed to fetch alerts');
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/alerts`, form);
      toast.success('Alert analyzed by AI!');
      setForm({ name: '', message: '', service: '' });
      fetchAlerts();
    } catch {
      toast.error('Failed to process alert');
    }
  };

  const dismiss = async (id) => {
    try {
      await axios.delete(`${API}/api/alerts/${id}`);
      setAlerts(alerts.filter(a => a.id !== id));
      toast.info('Alert dismissed');
    } catch {
      toast.error('Failed to dismiss alert');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">🚨 Submit Alert for AI Analysis</h2>
        <form onSubmit={submit} className="space-y-3">
          {['name', 'service', 'message'].map(field => (
            <input
              key={field}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 font-medium">
            🤖 Analyze Alert with AI
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 && <p className="text-slate-500 text-center py-8">No alerts yet.</p>}
        {alerts.map(alert => (
          <div key={alert.id} className={`rounded-xl p-5 border ${SEVERITY_COLORS[alert.aiSummary?.severity] || SEVERITY_COLORS.low}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white">{alert.name}</h3>
                <p className="text-slate-400 text-sm">{alert.service} · {new Date(alert.receivedAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                  alert.aiSummary?.severity === 'critical' ? 'bg-red-600' :
                  alert.aiSummary?.severity === 'high' ? 'bg-orange-600' :
                  alert.aiSummary?.severity === 'medium' ? 'bg-yellow-600' : 'bg-slate-600'
                }`}>
                  {alert.aiSummary?.severity || 'unknown'}
                </span>
                <button onClick={() => dismiss(alert.id)} className="text-slate-400 hover:text-white text-sm">✕</button>
              </div>
            </div>
            {alert.aiSummary && (
              <div className="mt-3 space-y-2">
                <p className="text-slate-300 text-sm">{alert.aiSummary.summary}</p>
                {alert.aiSummary.immediateActions?.length > 0 && (
                  <ul className="list-disc list-inside text-green-400 text-sm space-y-1">
                    {alert.aiSummary.immediateActions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
