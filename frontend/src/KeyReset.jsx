// src/KeyReset.jsx
import React, { useState } from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const cardStyle = (dark) => ({
  backgroundColor: dark ? '#1e293b' : '#ffffff',
  color: dark ? '#f8fafc' : '#111',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  minWidth: '400px',
  fontFamily: 'system-ui, sans-serif'
});

const inputStyle = (dark) => ({
  width: '100%',
  marginTop: '8px',
  padding: '10px',
  fontSize: '14px',
  borderRadius: '6px',
  border: `1px solid ${dark ? '#475569' : '#ccc'}`,
  backgroundColor: dark ? '#0f172a' : '#f9f9f9',
  color: dark ? '#f1f5f9' : '#111'
});

const buttonStyle = {
  marginTop: '12px',
  padding: '10px 16px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer'
};

export default function KeyReset({ onClose, darkMode }) {
  const [keyInput, setKeyInput] = useState('');
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
    setIsValidating(true);

    try {
      // Validate first
      const validateRes = await fetch('http://localhost:8000/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'OPENAI_API_KEY', value: keyInput })
      });

      const validateJson = await validateRes.json();

      if (!validateJson.valid) {
        setMessage(`❌ Invalid Key: ${validateJson.error || 'Validation failed.'}`);
        setIsValidating(false);
        return;
      }

      // Update it
      const updateRes = await fetch('http://localhost:8000/update-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'OPENAI_API_KEY', value: keyInput })
      });

      const updateJson = await updateRes.json();

      if (updateJson.success) {
        setMessage('✅ Key updated successfully.');
      } else {
        setMessage(`❌ Update failed: ${updateJson.error}`);
      }
    } catch (err) {
      setMessage('❌ Network error while updating key.');
    }

    setIsValidating(false);
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={cardStyle(darkMode)} onClick={(e) => e.stopPropagation()}>
        <h3>🔐 Reset OpenAI API Key</h3>
        <input
          type="text"
          placeholder="sk-..."
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          style={inputStyle(darkMode)}
        />
        <button
          style={{
            ...buttonStyle,
            backgroundColor: '#10b981',
            color: '#fff',
            opacity: isValidating ? 0.6 : 1
          }}
          disabled={isValidating}
          onClick={handleSubmit}
        >
          {isValidating ? 'Validating...' : 'Submit'}
        </button>
        <div style={{ marginTop: '12px', fontSize: '14px' }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            ...buttonStyle,
            marginTop: '16px',
            backgroundColor: darkMode ? '#334155' : '#ccc',
            color: darkMode ? '#f1f5f9' : '#111'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
