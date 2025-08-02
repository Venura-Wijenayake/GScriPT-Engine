import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  Background,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  StartNode,
  PromptNode,
  OutputNode,
  GPTNode,
  TitleNode,
  ManualEntryNode,
  TextFileNode,
  PlotPointNode,
  ImageTagNode,
  OutroPromptNode
} from './CustomNodes.jsx';

import { assembleScript } from './utils/assembleScript.js';
import KeyReset from './KeyReset.jsx';

const transparentWrapper = {
  background: 'transparent',
  border: 'none',
  boxShadow: 'none'
};

const initialNodes = [
  { id: '1', type: 'start', data: {}, position: { x: 250, y: 5 }, style: transparentWrapper },
  { id: '2', type: 'title', data: { prompt: '' }, position: { x: 250, y: 100 }, style: transparentWrapper },
  { id: '3', type: 'prompt', data: { prompt: '' }, position: { x: 100, y: 220 }, style: transparentWrapper },
  { id: '4', type: 'gpt', data: { prompt: '', result: '' }, position: { x: 250, y: 340 }, style: transparentWrapper },
  { id: '5', type: 'output', data: { result: '' }, position: { x: 400, y: 460 }, style: transparentWrapper }
];

const initialEdges = [];

function FlowCanvas({ darkMode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showKeyReset, setShowKeyReset] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newNodeType, setNewNodeType] = useState('');

  const handleNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const handleConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: {
              stroke: darkMode ? '#f1f5f9' : '#333'
            }
          },
          eds
        )
      ),
    [darkMode]
  );

  const handleEdgeClick = useCallback(
    (event, edge) => {
      event.preventDefault();
      if (confirm('🗑️ Remove this connection?')) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [setEdges]
  );

  const updatePrompt = useCallback(
    (nodeId, value) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, prompt: value } } : n
        )
      );
    },
    [setNodes]
  );

  const updateRole = useCallback(
    (nodeId, value) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, role: value } } : n
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        const shared = {
          ...node,
          data: {
            ...node.data,
            darkMode
          },
          style: transparentWrapper
        };

        if (
          [
            'prompt',
            'gpt',
            'title',
            'manualentry',
            'textfile',
            'plotpoint',
            'imagetag',
            'outroprompt'
          ].includes(node.type)
        ) {
          shared.data.onChange = (val) => updatePrompt(node.id, val);
          shared.data.onRoleChange = (val) => updateRole(node.id, val);
        }

        return shared;
      })
    );
  }, [darkMode, setNodes, updatePrompt, updateRole]);

  useEffect(() => {
    window.getFlowState = () => ({ nodes, edges });

    window.loadFlowState = ({ nodes: newNodes, edges: newEdges }) => {
      setNodes(
        newNodes.map((node) => {
          const updated = {
            ...node,
            data: {
              ...node.data,
              darkMode
            },
            style: transparentWrapper
          };
          if (
            [
              'prompt',
              'gpt',
              'title',
              'manualentry',
              'textfile',
              'plotpoint',
              'imagetag',
              'outroprompt'
            ].includes(node.type)
          ) {
            updated.data.onChange = (val) => updatePrompt(node.id, val);
            updated.data.onRoleChange = (val) => updateRole(node.id, val);
          }
          return updated;
        })
      );
      setEdges(newEdges);
    };

    return () => {
      delete window.getFlowState;
      delete window.loadFlowState;
    };
  }, [nodes, edges, darkMode, setNodes, setEdges, updatePrompt, updateRole]);

  useEffect(() => {
    const saved = localStorage.getItem('gscript-canvas');
    if (saved) {
      const parsed = JSON.parse(saved);
      window.loadFlowState?.(parsed);
    }
  }, []);

  const handleRun = async () => {
    const updatedNodes = await Promise.all(
      nodes.map(async (node) => {
        if (node.type === 'gpt') {
          const incoming = edges.find((e) => e.target === node.id);
          const source = incoming && nodes.find((n) => n.id === incoming.source);
          const prompt = source?.data?.prompt || node.data?.prompt || '';

          if (!prompt) {
            return {
              ...node,
              data: {
                ...node.data,
                result: 'No prompt provided.',
                darkMode
              },
              style: transparentWrapper
            };
          }

          try {
            const res = await fetch('http://localhost:8000/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });

            const json = await res.json();
            const result = json.response || json.error || 'Error: No response';

            return {
              ...node,
              data: {
                ...node.data,
                result,
                darkMode
              },
              style: transparentWrapper
            };
          } catch (err) {
            return {
              ...node,
              data: {
                ...node.data,
                result: 'Error contacting backend',
                darkMode
              },
              style: transparentWrapper
            };
          }
        }

        if (node.type === 'output') {
          const incoming = edges.find((e) => e.target === node.id);
          const source = incoming && nodes.find((n) => n.id === incoming.source);
          const prompt = source?.data?.prompt || '';
          return {
            ...node,
            data: {
              ...node.data,
              result: prompt ? `Answer: ${prompt}` : 'No input',
              darkMode
            },
            style: transparentWrapper
          };
        }

        return {
          ...node,
          data: { ...node.data, darkMode },
          style: transparentWrapper
        };
      })
    );

    setNodes(updatedNodes);
  };

  const handleAssembleScript = () => {
    const script = assembleScript(nodes, edges);
    navigator.clipboard.writeText(script).then(() => {
      alert('📋 Script copied to clipboard!');
    });
  };

  const handleAddNode = () => {
    if (!newNodeType) return;

    const id = (nodes.length + 1).toString();
    const maxY = Math.max(...nodes.map((n) => n.position.y));
    const newNode = {
      id,
      type: newNodeType,
      data: { prompt: '', result: '' },
      position: { x: 250, y: maxY + 140 },
      style: transparentWrapper
    };

    setNodes((prev) => [...prev, newNode]);
    setNewNodeType('');
  };

  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      prompt: PromptNode,
      output: OutputNode,
      gpt: GPTNode,
      title: TitleNode,
      manualentry: ManualEntryNode,
      textfile: TextFileNode,
      plotpoint: PlotPointNode,
      imagetag: ImageTagNode,
      outroprompt: OutroPromptNode
    }),
    []
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: darkMode ? '#0f172a' : '#f9fafb',
        color: darkMode ? '#f9f9f9' : '#111',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}
    >
      <div
        style={{
          padding: '8px 16px',
          background: darkMode ? '#1e293b' : '#e2e8f0',
          borderBottom: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleRun} style={{ background: '#10b981', color: '#fff', padding: '8px 16px', fontSize: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            ▶️ Run
          </button>
          <button onClick={handleAssembleScript} style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', fontSize: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            🧩 Assemble Script
          </button>
          <select value={newNodeType} onChange={(e) => setNewNodeType(e.target.value)} style={{ padding: '6px', borderRadius: '6px' }}>
            <option value="">➕ Add Node</option>
            <option value="prompt">Prompt</option>
            <option value="gpt">GPT</option>
            <option value="output">Output</option>
            <option value="title">Title</option>
            <option value="manualentry">Manual Entry</option>
            <option value="textfile">Text File</option>
            <option value="plotpoint">Plot Point</option>
            <option value="imagetag">Image Tag</option>
            <option value="outroprompt">Outro</option>
          </select>
          <button onClick={handleAddNode} style={{ background: '#6366f1', color: '#fff', padding: '6px 12px', fontSize: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Add
          </button>
        </div>
        <button onClick={() => setShowKeyReset(true)} style={{ background: darkMode ? '#334155' : '#cbd5e1', color: darkMode ? '#f1f5f9' : '#111', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
          🔐 Reset API Key
        </button>
      </div>

      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant="dots" gap={16} size={1} color={darkMode ? '#475569' : '#cbd5e1'} />
          <Controls />
        </ReactFlow>
      </div>

      {showKeyReset && <KeyReset darkMode={darkMode} onClose={() => setShowKeyReset(false)} />}
    </div>
  );
}

export default FlowCanvas;
