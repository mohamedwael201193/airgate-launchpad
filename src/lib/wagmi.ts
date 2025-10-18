import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors';
import { getEnv, getWalletConnectProjectId } from '../air/env';

// Get environment configuration
const env = getEnv();

// Define Moca Devnet chain using environment variables
export const mocaDevnet = defineChain({
  id: Number(env.VITE_MOCA_CHAIN_ID),
  name: 'Moca Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MOCA',
    symbol: 'MOCA',
  },
  rpcUrls: {
    default: { 
      http: [env.VITE_MOCA_RPC_URL],
      webSocket: [env.VITE_MOCA_RPC_URL.replace('https://', 'wss://')],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Moca Explorer', 
      url: env.VITE_EXPLORER_BASE_URL,
      apiUrl: `${env.VITE_EXPLORER_BASE_URL}/api`,
    },
  },
  contracts: {
    // Add AIR Protocol contracts here when available
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11', // Standard multicall
      blockCreated: 0,
    },
  },
  testnet: true,
})

// Create wagmi configuration using environment variables
export const wagmiConfig = createConfig({
  chains: [mocaDevnet],
  transports: {
    [mocaDevnet.id]: http(env.VITE_MOCA_RPC_URL),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    metaMask({
      dappMetadata: {
        name: env.VITE_AIRGATE_BRAND,
        url: env.VITE_APP_URL,
        iconUrl: `${env.VITE_APP_URL}/logo.png`,
      },
    }),
    walletConnect({ 
      projectId: getWalletConnectProjectId(),
      showQrModal: true,
      metadata: {
        name: env.VITE_AIRGATE_BRAND,
        description: 'Privacy-preserving credential verification platform',
        url: env.VITE_APP_URL,
        icons: [`${env.VITE_APP_URL}/icon-192.png`],
      },
    }),
    coinbaseWallet({ 
      appName: env.VITE_AIRGATE_BRAND,
      appLogoUrl: `${env.VITE_APP_URL}/logo.png`,
    }),
  ],
})

// Export for use in components
export { mocaDevnet as defaultChain };

// Helper to get network info
export const getNetworkConfig = () => ({
  chainId: mocaDevnet.id,
  chainName: mocaDevnet.name,
  rpcUrl: mocaDevnet.rpcUrls.default.http[0],
  explorerUrl: mocaDevnet.blockExplorers.default.url,
  currency: {
    name: mocaDevnet.nativeCurrency.name,
    symbol: mocaDevnet.nativeCurrency.symbol,
    decimals: mocaDevnet.nativeCurrency.decimals,
  },
})