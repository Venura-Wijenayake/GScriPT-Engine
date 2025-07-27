import React from 'react';
import { Handle, Position } from 'reactflow';

// PromptNode: Editable input node
export function PromptNode({ data }) {
  const dark = data?.darkMode;

  const handleChange = (e) => {
    if (typeof data.onChange === 'function') {
      data.onChange(e.target.value);
    }
  };

  return (
    <div
      style={{
        pointerEvents: 'all',
        padding: '12px 16px',
        borderRadius: '12px',
        background: dark ? '#1e293b' : '#f0f4f9',
        border: `1px solid ${dark ? '#334155' : '#ccc'}`,
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 300,
        color: dark ? '#f1f5f9' : '#111'
      }}
    >
      <strong style={{ fontSize: 14 }}>{'Prompt'}</strong>
      <textarea
        rows="4"
        value={data.prompt || ''}
        onChange={handleChange}
        placeholder="Enter your prompt..."
        style={{
          marginTop: 8,
          width: '100%',
          resize: 'none',
          borderRadius: 6,
          padding: 8,
          fontSize: 13,
          fontFamily: 'monospace',
          border: `1px solid ${dark ? '#475569' : '#ccc'}`,
          background: dark ? '#0f172a' : '#fff',
          color: dark ? '#f1f5f9' : '#111',
          boxSizing: 'border-box'
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: dark ? '#94a3b8' : '#555',
          width: 10,
          height: 10
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: dark ? '#94a3b8' : '#555',
          width: 10,
          height: 10
        }}
      />
    </div>
  );
}

// OutputNode: Static display of prompt result
export function OutputNode({ data }) {
  const dark = data?.darkMode;

  return (
    <div
      style={{
        pointerEvents: 'all',
        padding: '12px 16px',
        borderRadius: '12px',
        background: dark ? '#1e293b' : '#f0f0f0',
        border: `1px solid ${dark ? '#334155' : '#ccc'}`,
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 300,
        color: dark ? '#f1f5f9' : '#111'
      }}
    >
      <strong style={{ fontSize: 14 }}>{'Output'}</strong>
      <div
        style={{
          marginTop: 8,
          padding: 8,
          borderRadius: 6,
          background: dark ? '#0f172a' : '#e5e7eb',
          fontSize: 13,
          fontFamily: 'monospace',
          color: dark ? '#f1f5f9' : '#111',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 160,
          overflowY: 'auto',
          border: `1px solid ${dark ? '#475569' : '#ccc'}`,
          boxSizing: 'border-box'
        }}
      >
        {data.result || 'Waiting for input...'}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: dark ? '#94a3b8' : '#555',
          width: 10,
          height: 10
        }}
      />
    </div>
  );
}

// StartNode: Simple entry block
export function StartNode({ data }) {
  const dark = data?.darkMode;

  return (
    <div
      style={{
        pointerEvents: 'all',
        padding: '10px 14px',
        borderRadius: '10px',
        border: `1px dashed ${dark ? '#64748b' : '#aaa'}`,
        background: dark ? '#111827' : '#fafafa',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 'bold',
        fontSize: 14,
        color: dark ? '#f8fafc' : '#333',
        maxWidth: 200,
        textAlign: 'center'
      }}
    >
      Start Node
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: dark ? '#94a3b8' : '#555',
          width: 10,
          height: 10
        }}
      />
    </div>
  );
}
