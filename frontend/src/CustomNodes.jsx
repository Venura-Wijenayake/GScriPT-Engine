// src/CustomNodes.jsx
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
  maxWidth: 400,
  minWidth: 240,
  color: dark ? '#f1f5f9' : '#111'
});

// Auto-expanding textarea style
const expandingTextareaStyle = (dark) => ({
  marginTop: 8,
  width: '100%',
  borderRadius: 6,
  padding: 8,
  fontSize: 13,
  fontFamily: 'monospace',
  border: `1px solid ${dark ? '#475569' : '#ccc'}`,
  background: dark ? '#0f172a' : '#ffffff',
  color: dark ? '#f1f5f9' : '#111',
  boxSizing: 'border-box',
  overflow: 'hidden',
  minHeight: 40
});

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

function AutoTextarea({ value, onChange, placeholder, dark }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={expandingTextareaStyle(dark)}
    />
  );
}

function RoleSelector({ value, onChange, dark }) {
  return (
    <select
      value={value || ''}
      onChange={onChange}
      style={{
        marginTop: 8,
        width: '100%',
        padding: 6,
        borderRadius: 6,
        fontSize: 13,
        background: dark ? '#0f172a' : '#ffffff',
        color: dark ? '#f8fafc' : '#111',
        border: `1px solid ${dark ? '#475569' : '#ccc'}`,
        fontFamily: 'system-ui'
      }}
    >
      <option value="">Select Role (optional)</option>
      <option value="tone">🎤 Tone</option>
      <option value="style">🎭 Style</option>
      <option value="plot">📈 Plot Point</option>
      <option value="twist">🔀 Twist</option>
      <option value="fact">📊 Fact</option>
      <option value="hook">🎬 Hook</option>
      <option value="outro">🔚 Outro</option>
      <option value="visual">🖼️ Visual</option>
    </select>
  );
}

// ✅ Prompt Node
export function PromptNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Prompt" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <AutoTextarea
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Enter your prompt..."
        dark={dark}
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
          ...expandingTextareaStyle(dark),
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowY: 'auto',
          minHeight: 60
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
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <AutoTextarea
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Ask something..."
        dark={dark}
      />
      <div
        style={{
          ...expandingTextareaStyle(dark),
          marginTop: 8,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
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
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Video Title..."
        style={expandingTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Manual Entry Node
export function ManualEntryNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Manual Entry" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <AutoTextarea
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Insert quote or detail..."
        dark={dark}
      />
    </NodeWrapper>
  );
}

// ✅ Text File Node
export function TextFileNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Text File" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="e.g. source.txt"
        style={expandingTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Plot Point Node
export function PlotPointNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Plot Point" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <AutoTextarea
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Optional beat..."
        dark={dark}
      />
    </NodeWrapper>
  );
}

// ✅ Image Tag Node
export function ImageTagNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Image Tag" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <input
        type="text"
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="image.png or cue text"
        style={expandingTextareaStyle(dark)}
      />
    </NodeWrapper>
  );
}

// ✅ Outro Prompt Node
export function OutroPromptNode({ data }) {
  const dark = data?.darkMode;
  return (
    <NodeWrapper label="Outro Prompt" dark={dark}>
      <RoleSelector
        value={data.role}
        onChange={(e) => data?.onRoleChange?.(e.target.value)}
        dark={dark}
      />
      <AutoTextarea
        value={data.prompt || ''}
        onChange={(e) => data?.onChange?.(e.target.value)}
        placeholder="Wrap-up or call to action..."
        dark={dark}
      />
    </NodeWrapper>
  );
}
