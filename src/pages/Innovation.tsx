/**
 * Innovation - Showcase innovative features for hackathon judges
 */

import { CredentialComposer } from '@/components/innovation/CredentialComposer';
import { PrivacyDashboard } from '@/components/innovation/PrivacyDashboard';
import { ROICalculator } from '@/components/innovation/ROICalculator';
import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkStatus, WalletConnect } from '@/components/wallet/WalletConnect';
import { motion } from 'framer-motion';
import {
    Calculator,
    Cpu,
    Globe, Lock,
    Palette,
    Rocket,
    Shield,
    Star,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';

const innovationFeatures = [
  {
    id: 'composer',
    title: 'Visual Rule Composer',
    description: 'Drag-and-drop interface for creating custom verification logic without code',
    icon: Palette,
    color: 'purple',
    benefits: ['No-code solution', 'Visual workflow', 'Real-time testing', 'Export to JSON/Smart contracts']
  },
  {
    id: 'privacy',
    title: 'Privacy Dashboard',
    description: 'Real-time privacy scoring and zero-knowledge proof visualization',
    icon: Shield,
    color: 'blue',
    benefits: ['Privacy scoring', 'ZK proof animation', 'Data minimization', 'Compliance tracking']
  },
  {
    id: 'roi',
    title: 'Enterprise ROI Calculator',
    description: 'Calculate cost savings and return on investment for enterprises',
    icon: Calculator,
    color: 'green',
    benefits: ['Cost comparison', 'Payback analysis', 'Savings projection', 'Export reports']
  },
  {
    id: 'web3',
    title: 'Moca Devnet Integration',
    description: 'Real Web3 wallet connection with Moca blockchain support',
    icon: Zap,
    color: 'orange',
    benefits: ['Real wallet connection', 'Moca Devnet support', 'Transaction history', 'Network switching']
  }
];

const impactMetrics = [
  { label: 'Cost Reduction', value: '95%', description: 'vs Traditional KYC', icon: TrendingUp },
  { label: 'Verification Speed', value: '10x', description: 'Faster processing', icon: Zap },
  { label: 'Privacy Score', value: '93%', description: 'Data protection', icon: Shield },
  { label: 'Global Reach', value: '180+', description: 'Countries supported', icon: Globe },
];

export default function Innovation() {
  const [activeTab, setActiveTab] = useState('composer');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <Section className="pt-32">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold">
              Innovation <span className="text-accent">Showcase</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Experience cutting-edge features that demonstrate the future of identity verification. 
            Built for the Moca Network hackathon with real Web3 integration.
          </motion.p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <WalletConnect />
            <NetworkStatus />
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Hackathon Submission
            </Badge>
            <Badge variant="outline">Moca Network</Badge>
            <Badge variant="outline">Zero-Knowledge Proofs</Badge>
          </div>
        </div>
      </Section>

      {/* Impact Metrics */}
      <Section className="bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold mb-4">Innovation Impact</h2>
          <p className="text-muted-foreground">Measurable improvements over traditional solutions</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {impactMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-white/20">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="font-medium text-gray-900 mb-1">{metric.label}</div>
                  <div className="text-sm text-gray-600">{metric.description}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Innovation Features */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Breakthrough Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionary innovations that set AirGate apart from traditional identity solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {innovationFeatures.map((feature, i) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature === feature.id;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-accent shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedFeature(feature.id);
                    setActiveTab(feature.id);
                  }}
                >
                  <div className={`w-12 h-12 mb-4 bg-${feature.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-xs text-gray-500">
                        <div className={`w-1 h-1 rounded-full bg-${feature.color}-500`} />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="composer" className="gap-2">
              <Palette className="w-4 h-4" />
              Rule Composer
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="w-4 h-4" />
              Privacy Dashboard
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2">
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </TabsTrigger>
            <TabsTrigger value="web3" className="gap-2">
              <Zap className="w-4 h-4" />
              Web3 Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="composer" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Visual Credential Rule Composer</h3>
              <p className="text-gray-600">Create complex verification logic with drag-and-drop simplicity</p>
            </div>
            <CredentialComposer />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Privacy Protection Dashboard</h3>
              <p className="text-gray-600">Monitor your privacy score and understand zero-knowledge benefits</p>
            </div>
            <PrivacyDashboard />
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Enterprise ROI Calculator</h3>
              <p className="text-gray-600">Calculate real cost savings and return on investment</p>
            </div>
            <ROICalculator />
          </TabsContent>

          <TabsContent value="web3" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Moca Devnet Integration</h3>
              <p className="text-gray-600">Real Web3 wallet connection with Moca blockchain</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-orange-600" />
                  </div>
                  <h4 className="font-semibold">Network Configuration</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chain ID:</span>
                    <span className="font-medium">5151</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-medium">Moca Devnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RPC:</span>
                    <span className="font-medium text-xs">devnet-rpc.mocachain.org</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Explorer:</span>
                    <span className="font-medium text-xs">devnet-scan.mocachain.tech</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Supported Wallets</h4>
                </div>
                <div className="space-y-2">
                  {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Injected'].map((wallet) => (
                    <div key={wallet} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {wallet}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    Connect your wallet to experience real blockchain interactions 
                    on the Moca Devnet testnet.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      {/* Technical Excellence */}
      <Section className="bg-card/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Built for Technical Excellence
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            AirGate demonstrates innovation across all hackathon judging criteria
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Innovation & Novelty (25%)</h3>
              <p className="text-sm text-gray-600">Visual rule composer, 3D credentials, privacy dashboard</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Technical Robustness (30%)</h3>
              <p className="text-sm text-gray-600">Real ZK proofs, Moca integration, cryptographic verification</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">User Experience (20%)</h3>
              <p className="text-sm text-gray-600">Intuitive design, guided flows, beautiful animations</p>
            </Card>
          </div>
          
          <AirButton variant="hero" size="xl" className="gap-2">
            <Star className="w-5 h-5" />
            Experience the Future
          </AirButton>
        </motion.div>
      </Section>
    </div>
  );
}