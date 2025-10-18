import { isDebugMode } from '@/air/env';
import { wagmiConfig } from '@/lib/wagmi';
import { darkTheme, Locale, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
});

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  if (isDebugMode()) {
    console.log('🌐 Initializing Web3 Provider with wagmi config');
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#5B3DF5', // Match our primary color (Electric Indigo)
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          showRecentTransactions={true}
          coolMode
          locale={'en' as Locale}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Export useful hooks
export { useAccount, useBalance, useChainId, useConnect, useDisconnect } from 'wagmi';

