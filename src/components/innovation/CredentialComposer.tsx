import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Copy, Download, Play, Plus, Shield, Trash2, Users, Zap } from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Credential types available in the palette
const CREDENTIAL_TYPES = [
  {
    id: 'kyc-basic',
    name: 'KYC Basic',
    icon: Shield,
    color: 'blue',
    description: 'Identity verification',
    fields: ['jurisdiction', 'isVerified', 'level']
  },
  {
    id: 'work-history',
    name: 'Work History',
    icon: Users,
    color: 'green',
    description: 'Employment verification',
    fields: ['employer', 'role', 'yearsExperience', 'verified']
  },
  {
    id: 'fan-badge',
    name: 'Fan Badge',
    icon: Zap,
    color: 'purple',
    description: 'Event attendance proof',
    fields: ['eventName', 'tier', 'attended']
  },
  {
    id: 'time-limit',
    name: 'Time Limit',
    icon: Clock,
    color: 'orange',
    description: 'Rate limiting constraint',
    fields: ['maxActions', 'timeWindow']
  }
];

interface RuleNode {
  id: string;
  type: 'credential' | 'operator' | 'constraint';
  credentialType?: string;
  operator?: 'AND' | 'OR' | 'NOT';
  constraint?: string;
  conditions?: Record<string, any>;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

export function CredentialComposer() {
  const [nodes, setNodes] = useState<RuleNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const addNode = useCallback((type: string, x: number, y: number) => {
    const newNode: RuleNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: type === 'AND' || type === 'OR' || type === 'NOT' ? 'operator' : 'credential',
      credentialType: type === 'AND' || type === 'OR' || type === 'NOT' ? undefined : type,
      operator: type === 'AND' || type === 'OR' || type === 'NOT' ? type as 'AND' | 'OR' | 'NOT' : undefined,
      x,
      y,
      conditions: {}
    };
    
    setNodes(prev => [...prev, newNode]);
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 60; // Offset for node center
    const y = e.clientY - rect.top - 30;
    
    addNode(draggedType, x, y);
    setDraggedType(null);
  }, [draggedType, addNode]);

  const generateRule = () => {
    // Convert visual nodes to JSON rule
    const rule = {
      id: `rule-${Date.now()}`,
      name: 'Custom Verification Rule',
      description: 'Generated from visual composer',
      version: '1.0',
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        credentialType: node.credentialType,
        operator: node.operator,
        conditions: node.conditions,
        position: { x: node.x, y: node.y }
      })),
      connections,
      createdAt: new Date().toISOString()
    };
    
    return rule;
  };

  const playAnimation = async () => {
    setIsPlaying(true);
    
    // Simulate rule execution animation
    for (const node of nodes) {
      setSelectedNode(node.id);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setSelectedNode(null);
    setIsPlaying(false);
  };

  const exportRule = () => {
    const rule = generateRule();
    const blob = new Blob([JSON.stringify(rule, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verification-rule.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyRule = async () => {
    const rule = generateRule();
    await navigator.clipboard.writeText(JSON.stringify(rule, null, 2));
    // Could add toast notification
  };

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex h-full">
        {/* Credential Palette */}
        <div className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Credential Palette</h3>
            <p className="text-sm text-gray-600">Drag credentials to create verification rules</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {CREDENTIAL_TYPES.map((cred) => {
              const Icon = cred.icon;
              return (
                <div
                  key={cred.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedType(cred.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${cred.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${cred.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">{cred.name}</div>
                    <div className="text-xs text-gray-500 truncate">{cred.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Logic Operators</h4>
            <div className="space-y-2">
              {['AND', 'OR', 'NOT'].map((op) => (
                <div
                  key={op}
                  draggable
                  onDragStart={() => setDraggedType(op)}
                  className="flex items-center justify-center p-2 bg-gray-100 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-200 transition-colors"
                >
                  <span className="font-mono text-sm font-semibold text-gray-700">{op}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <AirButton
              onClick={playAnimation}
              disabled={isPlaying || nodes.length === 0}
              className="w-full gap-2"
              size="sm"
            >
              <Play className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Test Rule'}
            </AirButton>
            
            <div className="flex gap-2">
              <AirButton
                onClick={copyRule}
                variant="outline"
                disabled={nodes.length === 0}
                className="flex-1 gap-2"
                size="sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </AirButton>
              <AirButton
                onClick={exportRule}
                variant="outline"
                disabled={nodes.length === 0}
                className="flex-1 gap-2"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Export
              </AirButton>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="absolute inset-4">
            {nodes.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Rule</h3>
                  <p className="text-gray-600 max-w-sm">
                    Drag credentials from the palette to create custom verification logic. 
                    Connect them with AND, OR, NOT operators.
                  </p>
                </div>
              </div>
            )}
            
            {/* Render nodes */}
            {nodes.map((node) => {
              const credType = CREDENTIAL_TYPES.find(t => t.id === node.credentialType);
              const isSelected = selectedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all transform ${
                    isSelected ? 'scale-110 z-10' : 'hover:scale-105'
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(node.id)}
                >
                  {node.type === 'credential' && credType ? (
                    <Card className={`p-3 w-32 bg-white shadow-lg border-2 ${
                      isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
                    }`}>
                      <div className="text-center">
                        <credType.icon className={`w-6 h-6 mx-auto mb-2 text-${credType.color}-600`} />
                        <div className="text-xs font-medium text-gray-900">{credType.name}</div>
                        <Badge variant="secondary" className="text-xs mt-1">{credType.color}</Badge>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Card>
                  ) : (
                    <Card className={`p-3 w-20 h-16 bg-gray-100 shadow-lg border-2 ${
                      isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-300'
                    } flex items-center justify-center`}>
                      <span className="font-mono text-sm font-bold text-gray-700">{node.operator}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 max-w-xs">
            <h4 className="font-medium text-gray-900 mb-1">Quick Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag credentials to canvas</li>
              <li>• Use AND/OR to combine rules</li>
              <li>• Click nodes to select them</li>
              <li>• Test your rule with Play button</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}