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

  const handleSave = () => {
    const state = window.getFlowState?.();
    if (state) {
      localStorage.setItem('gscript-canvas', JSON.stringify(state));
      alert('📝 Canvas state saved.');
    }
  };

  const handleLoad = () => {
    const state = localStorage.getItem('gscript-canvas');
    if (state) {
      const parsed = JSON.parse(state);
      window.loadFlowState?.(parsed);
    } else {
      alert('⚠️ No saved canvas found.');
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
          <button onClick={handleSave} style={buttonStyle}>
            💾 Save
          </button>
          <button onClick={handleLoad} style={buttonStyle}>
            📂 Load
          </button>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        <FlowCanvas darkMode={darkMode} />
      </main>
    </div>
  );
}

export default App;
