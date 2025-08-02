import React, { useState } from 'react';
import FlowCanvas from './FlowCanvas';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const appStyle = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, sans-serif',
    background: darkMode ? '#0f172a' : '#f9fafb',
    color: darkMode ? '#f9f9f9' : '#111',
    transition: 'background 0.3s ease, color 0.3s ease'
  };

  const headerStyle = {
    padding: '12px 20px',
    background: darkMode ? '#1e293b' : '#e2e8f0',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
    fontSize: '18px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    background: darkMode ? '#334155' : '#e2e8f0',
    color: darkMode ? '#f1f5f9' : '#111',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    marginLeft: '8px'
  };

  const handleExportJSON = () => {
    const data = window.getFlowState?.();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gscript-flow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        window.loadFlowState?.(data);
        alert('📁 Flow imported!');
      } catch (err) {
        alert('❌ Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportScript = () => {
    if (typeof window.handleExportScriptFile === 'function') {
      window.handleExportScriptFile();
    } else {
      alert('⚠️ Export function not available.');
    }
  };

  const handlePreviewScript = () => {
    if (typeof window.handlePreviewScriptModal === 'function') {
      window.handlePreviewScriptModal();
    } else {
      alert('⚠️ Preview function not available.');
    }
  };

  return (
    <div style={appStyle}>
      <header style={headerStyle}>
        <span>GScriPT Engine</span>
        <div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={buttonStyle}
            title="Toggle dark mode"
          >
            {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>

          <button onClick={handleExportScript} style={buttonStyle}>
            🧾 Save Script
          </button>

          <button onClick={handlePreviewScript} style={buttonStyle}>
            👁️ Preview
          </button>

          <button onClick={handleExportJSON} style={buttonStyle}>
            💽 Export JSON
          </button>

          <label htmlFor="import-json" style={{ ...buttonStyle, cursor: 'pointer' }}>
            📁 Import JSON
          </label>
          <input
            type="file"
            id="import-json"
            accept=".json"
            onChange={handleImportJSON}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        <FlowCanvas darkMode={darkMode} />
      </main>
    </div>
  );
}

export default App;
