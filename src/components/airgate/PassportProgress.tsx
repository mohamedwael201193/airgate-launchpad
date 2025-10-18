import { useAirGate } from "@/air/useAirGate";
import { useEffect, useState } from "react";

export function PassportProgress() {
  const { service } = useAirGate();
  const [creds, setCreds] = useState<any[]>([]);
  useEffect(() => {
    let live = true;
    (async () => {
      const list = await service.getCredentials?.();
      if (live) setCreds(list || []);
    })();
    return () => { live = false; };
  }, [service]);
  // Render badges: green when verified & not revoked/expired; yellow when issued but unverified; red when missing.
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Your Passport</h3>
      <div className="space-y-2">
        {creds.map((cred, index) => (
          <div key={cred.id || index} className="flex items-center gap-3 p-2 rounded border">
            <div className={`w-3 h-3 rounded-full ${
              cred.status === 'active' ? 'bg-green-500' : 
              cred.status === 'revoked' || cred.status === 'expired' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
            <span className="font-medium">{cred.type || cred.id}</span>
            <span className="text-sm text-gray-500">{cred.status}</span>
          </div>
        ))}
        {creds.length === 0 && (
          <p className="text-gray-500">No credentials found</p>
        )}
      </div>
    </div>
  );
}
