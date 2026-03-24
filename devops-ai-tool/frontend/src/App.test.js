import React, { useState } from 'react';
import LogAnalyzer from './components/LogAnalyzer';
import MetricsDashboard from './components/MetricsDashboard';
import AlertsPanel from './components/AlertsPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TABS = ['Log Analyzer', 'Metrics', 'Alerts'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Log Analyzer');

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">🤖 DevOps AI Tool</h1>
        <p className="text-slate-400 mt-1">Observability & Log Analysis powered by AI</p>
      </header>

      <nav className="flex gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'Log Analyzer' && <LogAnalyzer />}
        {activeTab === 'Metrics' && <MetricsDashboard />}
        {activeTab === 'Alerts' && <AlertsPanel />}
      </main>

      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
}
