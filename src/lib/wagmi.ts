import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Moca Devnet chain (Chain ID: 5151)
export const mocaDevnet = defineChain({
  id: 5151,
  name: 'Moca Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MOCA',
    symbol: 'MOCA',
  },
  rpcUrls: {
    default: { 
      http: ['https://devnet-rpc.mocachain.org'],
      webSocket: ['wss://devnet-rpc.mocachain.org'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Moca Explorer', 
      url: 'https://devnet-scan.mocachain.tech',
      apiUrl: 'https://devnet-scan.mocachain.tech/api',
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

// Create wagmi configuration
export const wagmiConfig = createConfig({
  chains: [mocaDevnet],
  transports: {
    [mocaDevnet.id]: http('https://devnet-rpc.mocachain.org'),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    metaMask({
      dappMetadata: {
        name: 'AirGate OS',
        url: 'https://airgate-os.vercel.app',
        iconUrl: 'https://airgate-os.vercel.app/logo.png',
      },
    }),
    walletConnect({ 
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
      showQrModal: true,
      metadata: {
        name: 'AirGate OS',
        description: 'Privacy-preserving credential verification platform',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://airgate-os.vercel.app',
        icons: [`${typeof window !== 'undefined' ? window.location.origin : 'https://airgate-os.vercel.app'}/logo.png`],
      },
    }),
    coinbaseWallet({ 
      appName: 'AirGate OS',
      appLogoUrl: 'https://airgate-os.vercel.app/logo.png',
    }),
  ],
})

// Export for use in components
export { mocaDevnet as defaultChain }

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