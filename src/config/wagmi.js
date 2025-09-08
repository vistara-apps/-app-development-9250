import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Faith Fighters Arena',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [base, baseSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
