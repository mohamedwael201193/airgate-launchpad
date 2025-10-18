import { AirButton } from '@/components/ui/air-button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mocaDevnet } from '@/lib/wagmi';
import { useAccount, useChainId, useConnect, useDisconnect } from '@/providers/Web3Provider';
import { ChevronDown, Copy, ExternalLink, Wallet } from 'lucide-react';
import { useState } from 'react';

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [showConnectors, setShowConnectors] = useState(false);

  const isCorrectChain = chainId === mocaDevnet.id;
  
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // Could add toast notification here
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`${mocaDevnet.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AirButton variant="outline" className="gap-2">
            <div className={`w-2 h-2 rounded-full ${isCorrectChain ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {truncateAddress(address)}
            <ChevronDown className="w-4 h-4" />
          </AirButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Connected Wallet</span>
              <Badge variant={isCorrectChain ? "default" : "secondary"}>
                {isCorrectChain ? "Moca Devnet" : `Chain ${chainId}`}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              {connector?.name || 'Unknown'} • {truncateAddress(address)}
            </div>
            {!isCorrectChain && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-yellow-800">
                  Please switch to Moca Devnet (5151) for full functionality
                </p>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-600">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (showConnectors) {
    return (
      <div className="space-y-2">
        {connectors.map((connector) => (
          <AirButton
            key={connector.id}
            variant="outline"
            disabled={isPending}
            onClick={() => {
              connect({ connector });
              setShowConnectors(false);
            }}
            className="w-full justify-start"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {connector.name}
          </AirButton>
        ))}
        <AirButton
          variant="ghost"
          onClick={() => setShowConnectors(false)}
          className="w-full"
        >
          Cancel
        </AirButton>
      </div>
    );
  }

  return (
    <AirButton
      onClick={() => setShowConnectors(true)}
      disabled={isPending}
      className="gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </AirButton>
  );
}

// Network status indicator component
export function NetworkStatus() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  
  if (!isConnected) return null;
  
  const isCorrectChain = chainId === mocaDevnet.id;
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
      isCorrectChain 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isCorrectChain ? 'bg-green-500' : 'bg-yellow-500'}`} />
      {isCorrectChain ? 'Moca Devnet' : `Chain ${chainId}`}
    </div>
  );
}