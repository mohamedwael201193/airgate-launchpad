import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Shield, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PrivacyMetric {
  label: string;
  value: number;
  maxValue: number;
  description: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
}

interface DataField {
  name: string;
  shared: boolean;
  encrypted: boolean;
  essential: boolean;
  description: string;
}

export function PrivacyDashboard() {
  const [animationStep, setAnimationStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Privacy metrics
  const privacyMetrics: PrivacyMetric[] = [
    {
      label: 'Data Minimization',
      value: 92,
      maxValue: 100,
      description: 'Only essential data is processed',
      status: 'excellent'
    },
    {
      label: 'Encryption Strength',
      value: 98,
      maxValue: 100,
      description: 'Military-grade encryption (AES-256)',
      status: 'excellent'
    },
    {
      label: 'Zero-Knowledge Score',
      value: 87,
      maxValue: 100,
      description: 'Proofs reveal minimal information',
      status: 'good'
    },
    {
      label: 'Selective Disclosure',
      value: 95,
      maxValue: 100,
      description: 'Users control what to reveal',
      status: 'excellent'
    }
  ];

  // Data fields comparison
  const dataFields: DataField[] = [
    { name: 'Identity Verified', shared: true, encrypted: true, essential: true, description: 'Proves identity without revealing details' },
    { name: 'Full Name', shared: false, encrypted: true, essential: false, description: 'Kept private, never shared' },
    { name: 'Date of Birth', shared: false, encrypted: true, essential: false, description: 'Only age threshold is proven' },
    { name: 'Address', shared: false, encrypted: true, essential: false, description: 'Only jurisdiction is proven' },
    { name: 'Document Number', shared: false, encrypted: true, essential: false, description: 'Never leaves user device' },
    { name: 'Verification Status', shared: true, encrypted: false, essential: true, description: 'Public proof of verification' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: PrivacyMetric['status']) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status: PrivacyMetric['status']) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy Dashboard</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Monitor your privacy protection in real-time. AirGate uses zero-knowledge proofs to verify credentials 
          without exposing personal data.
        </p>
      </div>

      {/* Privacy Score Overview */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Privacy Score</h3>
            <p className="text-sm text-gray-600">Your data protection level</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">93%</div>
            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
          </div>
        </div>
        <Progress value={93} className="h-3 mb-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor (0-25%)</span>
          <span>Good (26-75%)</span>
          <span>Excellent (76-100%)</span>
        </div>
      </Card>

      {/* Privacy Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {privacyMetrics.map((metric, index) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  {getStatusIcon(metric.status)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{metric.label}</h4>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">{metric.value}%</div>
              </div>
            </div>
            <Progress value={metric.value} className="h-2" />
          </Card>
        ))}
      </div>

      {/* ZK Proof Animation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Zero-Knowledge Proof Generation</h3>
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" />
            Live Demo
          </Badge>
        </div>
        
        <div className="relative bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className={`p-3 bg-blue-100 rounded-lg transition-all ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                <div className="font-medium text-blue-900">Personal Data</div>
                <div className="text-sm text-blue-700">Encrypted locally</div>
              </div>
              <div className={`p-3 bg-purple-100 rounded-lg transition-all ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                <div className="font-medium text-purple-900">ZK Circuit</div>
                <div className="text-sm text-purple-700">Generates proof</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all ${animationStep >= 2 ? 'animate-pulse' : ''}`}></div>
              <div className="text-xs text-gray-500 mt-1">Processing</div>
            </div>
            
            <div className="space-y-2">
              <div className={`p-3 bg-green-100 rounded-lg transition-all ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                <div className="font-medium text-green-900">ZK Proof</div>
                <div className="text-sm text-green-700">No personal data</div>
              </div>
              <div className={`p-3 bg-orange-100 rounded-lg transition-all ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                <div className="font-medium text-orange-900">Verification</div>
                <div className="text-sm text-orange-700">Publicly verifiable</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>Your personal data never leaves your device. Only mathematical proofs are shared.</p>
        </div>
      </Card>

      {/* Data Sharing Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Data Sharing: Traditional vs AirGate</h3>
          <AirButton
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            className="gap-2"
          >
            {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showComparison ? 'Hide' : 'Show'} Comparison
          </AirButton>
        </div>
        
        {showComparison && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional KYC */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Traditional KYC</h4>
                  <p className="text-xs text-gray-500">Data exposure model</p>
                </div>
              </div>
              <div className="space-y-2">
                {dataFields.map((field) => (
                  <div key={field.name} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{field.name}</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">EXPOSED</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <div className="text-sm font-medium text-red-800">⚠ Privacy Risk: HIGH</div>
                <div className="text-xs text-red-600">All personal data is stored and shared</div>
              </div>
            </Card>

            {/* AirGate ZK */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AirGate ZK Proofs</h4>
                  <p className="text-xs text-gray-500">Zero-knowledge model</p>
                </div>
              </div>
              <div className="space-y-2">
                {dataFields.map((field) => (
                  <div key={field.name} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{field.name}</span>
                    <Badge className={field.shared ? "bg-blue-100 text-blue-800 text-xs" : "bg-green-100 text-green-800 text-xs"}>
                      {field.shared ? 'PROOF ONLY' : 'PRIVATE'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="text-sm font-medium text-green-800">✓ Privacy Risk: MINIMAL</div>
                <div className="text-xs text-green-600">Only proofs are shared, never personal data</div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Privacy Tips */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Privacy Protection Tips</h4>
        </div>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Your credentials are stored locally and encrypted</li>
          <li>• Zero-knowledge proofs reveal only what's necessary</li>
          <li>• You control which attributes to disclose</li>
          <li>• Credentials can be revoked without affecting privacy</li>
          <li>• All cryptographic operations happen on your device</li>
        </ul>
      </Card>
    </div>
  );
}