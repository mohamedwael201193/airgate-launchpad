import { useAirGate } from "@/air/useAirGate";
import { Badge, Briefcase, CheckCircle, Clock, Heart, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";

export function PassportProgress() {
  const { service, credentials, stats } = useAirGate();
  const [creds, setCreds] = useState<any[]>([]);
  
  useEffect(() => {
    setCreds(credentials || []);
  }, [credentials]);

  const getCredentialIcon = (schema: string) => {
    switch (schema) {
      case 'KYC_BASIC': return <User className="w-4 h-4" />;
      case 'WORK_HISTORY': return <Briefcase className="w-4 h-4" />;
      case 'FAN_BADGE': return <Heart className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 text-xs">✓ Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 text-xs">⚠ Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800 text-xs">✗ Revoked</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">⏳ Pending</Badge>;
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-900">Your Credential Passport</h3>
      </div>

      {/* Stats */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-blue-600">{stats.activeCredentials || 0}</div>
            <div className="text-xs text-blue-500">Active</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-bold text-green-600">{stats.verificationsCount || 0}</div>
            <div className="text-xs text-green-500">Verifications</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="font-bold text-purple-600">{stats.gasSaved || '$0'}</div>
            <div className="text-xs text-purple-500">Gas Saved</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="font-bold text-orange-600">{stats.privacyScore || '0%'}</div>
            <div className="text-xs text-orange-500">Privacy</div>
          </div>
        </div>
      )}

      {/* Credentials */}
      <div className="space-y-3">
        {creds.map((cred, index) => (
          <div key={cred.id || index} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 hover:bg-gray-100/50 transition-colors">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              cred.status === 'active' ? 'bg-green-500 text-white' : 
              cred.status === 'revoked' || cred.status === 'expired' ? 'bg-red-500 text-white' : 
              'bg-yellow-500 text-white'
            }`}>
              {getCredentialIcon(cred.schema)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{cred.schema || 'Unknown Credential'}</span>
                {getStatusBadge(cred.status)}
              </div>
              <div className="text-sm text-gray-600">
                Issued: {new Date(cred.issuedAt).toLocaleDateString()} • 
                Expires: {new Date(cred.expiresAt).toLocaleDateString()}
              </div>
              {cred.data && (
                <div className="text-xs text-gray-500 mt-1">
                  {cred.schema === 'KYC_BASIC' && cred.data.firstName && 
                    `${cred.data.firstName} ${cred.data.lastName} (${cred.data.jurisdiction})`}
                  {cred.schema === 'WORK_HISTORY' && cred.data.employer && 
                    `${cred.data.role} at ${cred.data.employer}`}
                  {cred.schema === 'FAN_BADGE' && cred.data.eventName && 
                    `${cred.data.eventName} - ${cred.data.tier}`}
                </div>
              )}
            </div>

            {cred.status === 'active' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {cred.status === 'expired' && (
              <Clock className="w-5 h-5 text-red-500" />
            )}
          </div>
        ))}
        
        {creds.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No credentials yet</p>
            <p className="text-sm text-gray-400">Complete a verification flow to earn your first credential</p>
          </div>
        )}
      </div>
    </div>
  );
}
