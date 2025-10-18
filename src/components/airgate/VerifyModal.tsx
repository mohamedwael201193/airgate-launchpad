import { getIssuerId, getVerifierId } from "@/air/programs";
import { useAirGate } from "@/air/useAirGate";

export function VerifyModal({ demoKey, onPass, onFail }: { demoKey: "defiJob"|"fanVip"|"traderTier"; onPass: (p:any)=>void; onFail?:(e:any)=>void }) {
  const { service, login } = useAirGate();

  async function runFlow() {
    try {
      await login();
      // Issue any missing credentials for this demo (deep-link issuance UIs via SDK)
      if (demoKey === "defiJob") {
        await service.issueCredential?.({ programId: getIssuerId("KYC_BASIC") });
        await service.issueCredential?.({ programId: getIssuerId("WORK_HISTORY") });
        const proofKyc = await service.createVerificationProof?.({ programId: getVerifierId("DEFI_JOB_GATE_KYC") });
        const proofWork = await service.createVerificationProof?.({ programId: getVerifierId("DEFI_JOB_GATE_WORK") });
        onPass?.({ proofKyc, proofWork });
        return;
      }
      if (demoKey === "fanVip") {
        await service.issueCredential?.({ programId: getIssuerId("FAN_BADGE") });
        const proof = await service.createVerificationProof?.({ programId: getVerifierId("FAN_VIP_GATE") });
        onPass?.(proof);
        return;
      }
      if (demoKey === "traderTier") {
        // User must have non-US jurisdiction in KYC
        await service.issueCredential?.({ programId: getIssuerId("KYC_BASIC") });
        const proof = await service.createVerificationProof?.({ programId: getVerifierId("TRADER_TIER_GATE") });
        onPass?.(proof);
      }
    } catch (e) { onFail?.(e); }
  }

  // Render your existing modal UI; hook runFlow to the primary action button.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Verify Credentials</h2>
        <p className="text-gray-600 mb-6">Click to start the verification flow for {demoKey}</p>
        <button 
          onClick={runFlow}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Start Verification
        </button>
      </div>
    </div>
  );
}
