import React from 'react';
import { Handle, Position } from 'reactflow';

// Shared port style
const portStyle = (dark) => ({
  background: dark ? '#94a3b8' : '#555',
  width: 10,
  height: 10
});

// Shared wrapper style for all nodes
const sharedBoxStyle = (dark) => ({
  pointerEvents: 'all',
  padding: '12px 16px',
  borderRadius: '12px',
  background: dark ? '#1e293b' : '#f0f4f9',
  border: `1px solid ${dark ? '#334155' : '#ccc'}`,
  fontFamily: 'system-ui, sans-serif',
  maxWidth: 300,
  color: dark ? '#f1f5f9' : '#111'
});

// Shared textarea/input style
const sharedTextareaStyle = (dark) => ({
  marginTop: 8,
  width: '100%',
  resize: 'both',
  borderRadius: 6,
  padding: 8,
  fontSize: 13,
  fontFamily: 'monospace',
  border: `1px solid ${dark ? '#475569' : '#ccc'}`,
  background: dark ? '#0f172a' : '#ffffff',
  color: dark ? '#f1f5f9' : '#111',
  boxSizing: 'border-box'
});

// Shared wrapper component
function NodeWrapper({ label, children, dark, hideSource = false, hideTarget = false }) {
  return (
    <div className="node-block" style={sharedBoxStyle(dark)}>
      <strong style={{ fontSize: 14 }}>{label}</strong>
      {children}
      {!hideTarget && <Handle type="target" position={Position.Left} style={portStyle(dark)} />}
      {!hideSource && <Handle type="source" position={Position.Right} style={portStyle(dark)} />}
    </div>
  );
}

// ✅ Prompt Node
export function PromptNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Prompt" dark={dark}>
      <textarea
        rows="4"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Enter your prompt..."
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Output Node
export function OutputNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Output" dark={dark} hideSource>
      <div
        style={{
          ...sharedTextareaStyle(dark),
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowY: 'auto',
          maxHeight: 160
        }}
      >
        {data.result || 'Waiting for input...'}
      </div>
    </NodeWrapper>
  );
}

// ✅ GPT Node
export function GPTNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="GPT Node" dark={dark}>
      <textarea
        rows="3"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Ask something..."
        style={sharedTextareaStyle(dark)}
      />
      <div
        style={{
          ...sharedTextareaStyle(dark),
          marginTop: 8,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 120,
          overflowY: 'auto'
        }}
      >
        {data.result || 'No output yet.'}
      </div>
    </NodeWrapper>
  );
}

// ✅ Start Node
export function StartNode({ data }) {
  const dark = data?.darkMode;
  return (
    <div
      className="node-block"
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
      <Handle type="source" position={Position.Right} style={portStyle(dark)} />
    </div>
  );
}

// ✅ Title Node
export function TitleNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Title" dark={dark}>
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Video Title..."
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Manual Entry Node
export function ManualEntryNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Manual Entry" dark={dark}>
      <textarea
        rows="3"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Insert quote or detail..."
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Text File Node
export function TextFileNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Text File" dark={dark}>
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="e.g. source.txt"
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Plot Point Node
export function PlotPointNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Plot Point" dark={dark}>
      <textarea
        rows="2"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Optional beat..."
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Image Tag Node
export function ImageTagNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Image Tag" dark={dark}>
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="image.png or cue text"
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Outro Prompt Node
export function OutroPromptNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Outro Prompt" dark={dark}>
      <textarea
        rows="2"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Wrap-up or call to action..."
        style={sharedTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}
