import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function LogAnalyzer() {
  const [logs, setLogs] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!logs.trim()) return toast.error('Please enter some logs');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/logs/analyze`, { logs });
      setResult(data);
      toast.success('Analysis complete!');
    } catch {
      toast.error('Analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/logs/upload`, formData);
      setResult(data);
      toast.success(`Analyzed ${file.name}`);
    } catch {
      toast.error('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">📋 Log Analyzer</h2>
        <textarea
          className="w-full h-48 bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          placeholder="Paste your logs here..."
          value={logs}
          onChange={e => setLogs(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={analyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : '🔍 Analyze with AI'}
          </button>
          <label className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium cursor-pointer">
            📁 Upload Log File
            <input type="file" accept=".log,.txt" className="hidden" onChange={uploadFile} />
          </label>
        </div>
      </div>

      {result && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex gap-6 text-center">
            <Stat label="Total Lines" value={result.parsed?.total} color="text-blue-400" />
            <Stat label="Errors" value={result.parsed?.errors} color="text-red-400" />
            <Stat label="Warnings" value={result.parsed?.warnings} color="text-yellow-400" />
          </div>

          <Section title="📝 Summary" content={result.analysis?.summary} />
          <Section title="🔴 Root Cause" content={result.analysis?.rootCause} />

          {result.analysis?.anomalies?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-300 mb-2">⚠️ Anomalies</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {result.analysis.anomalies.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}

          {result.analysis?.recommendations?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-300 mb-2">✅ Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-green-400">
                {result.analysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div className="bg-slate-900 rounded-lg p-4 flex-1">
    <div className={`text-3xl font-bold ${color}`}>{value ?? '-'}</div>
    <div className="text-slate-400 text-sm mt-1">{label}</div>
  </div>
);

const Section = ({ title, content }) =>
  content ? (
    <div>
      <h3 className="font-semibold text-slate-300 mb-1">{title}</h3>
      <p className="text-slate-400">{content}</p>
    </div>
  ) : null;
