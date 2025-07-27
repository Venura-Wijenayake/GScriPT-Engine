// src/FlowCanvas.jsx
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  Background,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';

import { StartNode, PromptNode, OutputNode } from './CustomNodes.jsx';

const initialNodes = [
  {
    id: '1',
    type: 'start',
    data: {},
    position: { x: 250, y: 5 }
  },
  {
    id: '2',
    type: 'prompt',
    data: { prompt: '' },
    position: { x: 100, y: 150 }
  },
  {
    id: '3',
    type: 'output',
    data: { result: '' },
    position: { x: 400, y: 150 }
  }
];

const initialEdges = [];

function FlowCanvas({ darkMode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.type === 'prompt'
          ? {
              ...node,
              data: {
                ...node.data,
                darkMode,
                onChange: (val) => updatePrompt(node.id, val)
              }
            }
          : {
              ...node,
              data: {
                ...node.data,
                darkMode
              }
            }
      )
    );
  }, [darkMode, setNodes, updatePrompt]);

  const handleRun = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'output') {
          const incoming = edges.find((e) => e.target === node.id);
          const source = incoming && nodes.find((n) => n.id === incoming.source);
          const prompt = source?.data?.prompt || '';
          return {
            ...node,
            data: {
              ...node.data,
              result: prompt ? `Answer: ${prompt}` : 'No input'
            }
          };
        }
        return node;
      })
    );
  };

  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      prompt: PromptNode,
      output: OutputNode
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
          borderBottom: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`
        }}
      >
        <button
          onClick={handleRun}
          style={{
            background: '#10b981',
            color: '#fff',
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ▶️ Run
        </button>
      </div>

      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background
            variant="dots"
            gap={16}
            size={1}
            color={darkMode ? '#475569' : '#cbd5e1'}
          />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowCanvas;
