import { getIssuerId, getVerifierId } from "@/air/programs";
import { useAirGate } from "@/air/useAirGate";
import { LoadingSpinner, ProgressBar } from "@/components/ui/loading";
import { CheckCircle, Clock, Shield, Trophy, X, Zap } from "lucide-react";
import { useState } from "react";
import Confetti from "react-confetti";
import { ProofViewer } from "./ProofViewer";

type VerifyStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  issuerId?: string;
  verifierId?: string;
};

export function VerifyModal({ 
  demoKey, 
  onPass, 
  onFail, 
  onClose 
}: { 
  demoKey: "defiJob" | "fanVip" | "traderTier"; 
  onPass: (p: any) => void; 
  onFail?: (e: any) => void;
  onClose?: () => void;
}) {
  const { login, issue, verify, ready } = useAirGate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Define steps for each demo scenario
  const getSteps = (): VerifyStep[] => {
    if (demoKey === "defiJob") {
      return [
        {
          id: "login",
          title: "Connect Wallet",
          description: "Establishing secure connection",
          status: 'pending'
        },
        {
          id: "kyc",
          title: "Issue KYC Credential",
          description: "Verifying identity documents",
          status: 'pending',
          issuerId: getIssuerId("KYC_BASIC")
        },
        {
          id: "work",
          title: "Issue Work History",
          description: "Validating employment records",
          status: 'pending',
          issuerId: getIssuerId("WORK_HISTORY")
        },
        {
          id: "proof",
          title: "Generate ZK Proofs",
          description: "Creating privacy-preserving verification",
          status: 'pending',
          verifierId: getVerifierId("DEFI_JOB_GATE_KYC")
        },
        {
          id: "complete",
          title: "Access Granted",
          description: "Welcome to DeFi Elite Jobs!",
          status: 'pending'
        }
      ];
    }
    
    if (demoKey === "fanVip") {
      return [
        {
          id: "login",
          title: "Connect Wallet",
          description: "Establishing secure connection",
          status: 'pending'
        },
        {
          id: "fan",
          title: "Issue Fan Badge",
          description: "Verifying event attendance",
          status: 'pending',
          issuerId: getIssuerId("FAN_BADGE")
        },
        {
          id: "proof",
          title: "Generate ZK Proof",
          description: "Creating privacy-preserving verification",
          status: 'pending',
          verifierId: getVerifierId("FAN_VIP_GATE")
        },
        {
          id: "complete",
          title: "VIP Access Unlocked",
          description: "Enjoy exclusive fan perks!",
          status: 'pending'
        }
      ];
    }

    // traderTier
    return [
      {
        id: "login",
        title: "Connect Wallet",
        description: "Establishing secure connection",
        status: 'pending'
      },
      {
        id: "kyc",
        title: "Issue KYC Credential",
        description: "Verifying trader identity",
        status: 'pending',
        issuerId: getIssuerId("KYC_BASIC")
      },
      {
        id: "proof",
        title: "Generate ZK Proof",
        description: "Creating privacy-preserving verification",
        status: 'pending',
        verifierId: getVerifierId("TRADER_TIER_GATE")
      },
      {
        id: "complete",
        title: "Pro Tier Activated",
        description: "Access advanced trading features!",
        status: 'pending'
      }
    ];
  };

  const [steps, setSteps] = useState<VerifyStep[]>(getSteps());

  const updateStepStatus = (stepIndex: number, status: VerifyStep['status']) => {
    setSteps(prev => prev.map((step, i) => 
      i === stepIndex ? { ...step, status } : step
    ));
  };

  const runFlow = async () => {
    if (!ready) return;
    
    setIsRunning(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Step 1: Login
      updateStepStatus(0, 'running');
      await login();
      await new Promise(resolve => setTimeout(resolve, 800));
      updateStepStatus(0, 'completed');
      setCurrentStep(1);

      const proofs: any[] = [];

      // Execute scenario-specific steps
      if (demoKey === "defiJob") {
        // Step 2: Issue KYC
        updateStepStatus(1, 'running');
        const kycCred = await issue("KYC_BASIC", { 
          jurisdiction: 'UK' 
        });
        updateStepStatus(1, 'completed');
        setCurrentStep(2);

        // Step 3: Issue Work History  
        updateStepStatus(2, 'running');
        const workCred = await issue("WORK_HISTORY", { 
          employer: 'TechCorp', role: 'Senior Dev' 
        });
        updateStepStatus(2, 'completed');
        setCurrentStep(3);

        // Step 4: Generate Proofs
        updateStepStatus(3, 'running');
        const proofKyc = await verify("DEFI_JOB_GATE_KYC");
        const proofWork = await verify("DEFI_JOB_GATE_WORK");
        proofs.push(proofKyc, proofWork);
        updateStepStatus(3, 'completed');
        setCurrentStep(4);

      } else if (demoKey === "fanVip") {
        // Step 2: Issue Fan Badge
        updateStepStatus(1, 'running');
        const fanCred = await issue("FAN_BADGE", { 
          event: 'MetaVerse Concert 2024' 
        });
        updateStepStatus(1, 'completed');
        setCurrentStep(2);

        // Step 3: Generate Proof
        updateStepStatus(2, 'running');
        const proof = await verify("FAN_VIP_GATE");
        proofs.push(proof);
        updateStepStatus(2, 'completed');
        setCurrentStep(3);

      } else if (demoKey === "traderTier") {
        // Step 2: Issue KYC
        updateStepStatus(1, 'running');
        const kycCred = await issue("KYC_BASIC", { 
          jurisdiction: 'UK' 
        });
        updateStepStatus(1, 'completed');
        setCurrentStep(2);

        // Step 3: Generate Proof
        updateStepStatus(2, 'running');
        const proof = await verify("TRADER_TIER_GATE");
        proofs.push(proof);
        updateStepStatus(2, 'completed');
        setCurrentStep(3);
      }

      // Final step: Complete
      updateStepStatus(steps.length - 1, 'completed');
      
      setResults({ proofs, success: true, timestamp: Date.now() });
      
      // Celebrate with confetti effect
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onPass(proofs);
      }, 3000);

    } catch (e: any) {
      console.error("Verification failed:", e);
      setError(e.message || "Verification failed");
      updateStepStatus(currentStep, 'error');
      onFail?.(e);
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (step: VerifyStep, index: number) => {
    if (step.status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (step.status === 'running') return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    if (step.status === 'error') return <X className="w-5 h-5 text-red-500" />;
    return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
  };

  const getDemoIcon = () => {
    if (demoKey === "defiJob") return <Zap className="w-8 h-8 text-purple-500" />;
    if (demoKey === "fanVip") return <Trophy className="w-8 h-8 text-yellow-500" />;
    return <Shield className="w-8 h-8 text-blue-500" />;
  };

  const getDemoTitle = () => {
    if (demoKey === "defiJob") return "DeFi Elite Jobs";
    if (demoKey === "fanVip") return "Fan VIP Access";
    return "Pro Trader Tier";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getDemoIcon()}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getDemoTitle()}</h2>
                <p className="text-sm text-gray-600">Credential Verification</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  step.status === 'running' ? 'bg-blue-50 border border-blue-200' :
                  step.status === 'completed' ? 'bg-green-50 border border-green-200' :
                  step.status === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-gray-50'
                }`}
              >
                {getStepIcon(step, index)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.status === 'running' && (
                    <div className="mt-2">
                      <ProgressBar 
                        progress={60} 
                        showPercentage={false} 
                        color="blue"
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {results && (
            <div className="mb-4">
              <div className="text-center mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl mb-2">🎉</div>
                <p className="font-medium text-green-800">Verification Complete!</p>
                <p className="text-sm text-green-600">
                  {results.proofs.length} credential proof{results.proofs.length > 1 ? 's' : ''} generated
                </p>
              </div>
              
              {/* Display each proof result */}
              <div className="space-y-3">
                {results.proofs.map((proof: any, index: number) => (
                  <ProofViewer
                    key={index}
                    result={{
                      status: proof.status || 'verified',
                      txHash: proof.txHash,
                      timestamp: results.timestamp,
                      programId: proof.programId,
                      credentialId: proof.credentialId,
                      proofId: proof.id,
                      metadata: proof.metadata
                    }}
                    explorerUrl="https://devnet-explorer.mocachain.org"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!results && (
            <button 
              onClick={runFlow}
              disabled={!ready || isRunning}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                ready && !isRunning
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!ready ? (
                <>
                  <LoadingSpinner size="sm" />
                  Initializing...
                </>
              ) : isRunning ? (
                <>
                  <LoadingSpinner size="sm" />
                  Verifying...
                </>
              ) : (
                'Start Verification'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
