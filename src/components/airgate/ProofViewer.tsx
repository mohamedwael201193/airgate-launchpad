import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, ExternalLink, Shield, XCircle } from 'lucide-react';

interface VerificationResult {
  status: string;
  txHash?: string;
  timestamp?: number;
  programId?: string;
  credentialId?: string;
  proofId?: string;
  metadata?: Record<string, any>;
}

interface ProofViewerProps {
  result: VerificationResult;
  explorerUrl?: string;
  className?: string;
}

export function ProofViewer({ result, explorerUrl, className = '' }: ProofViewerProps) {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
      case 'verified':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'non-compliant':
      case 'failed':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
      case 'verified':
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✓ {status}</Badge>;
      case 'non-compliant':
      case 'failed':
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">✗ {status}</Badge>;
      case 'pending':
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ {status}</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  };

  const openExplorer = () => {
    if (result.txHash && explorerUrl) {
      window.open(`${explorerUrl}/tx/${result.txHash}`, '_blank');
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status)}
            <h3 className="text-lg font-semibold text-gray-900">Verification Result</h3>
          </div>
          {getStatusBadge(result.status)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="text-sm text-gray-900">{result.status || 'Unknown'}</div>
            </div>
            
            {result.programId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Program ID</label>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {result.programId}
                </div>
              </div>
            )}

            {result.credentialId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Credential ID</label>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {result.credentialId}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {result.timestamp && (
              <div>
                <label className="text-sm font-medium text-gray-500">Timestamp</label>
                <div className="text-sm text-gray-900">
                  {formatTimestamp(result.timestamp)}
                </div>
              </div>
            )}

            {result.proofId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Proof ID</label>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {result.proofId}
                </div>
              </div>
            )}

            {result.txHash && (
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction Hash</label>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {result.txHash}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {result.metadata && Object.keys(result.metadata).length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Metadata</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        {result.txHash && explorerUrl && (
          <div className="pt-4 border-t border-gray-200">
            <AirButton 
              onClick={openExplorer}
              variant="outline"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Moca Explorer
            </AirButton>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProofViewer;