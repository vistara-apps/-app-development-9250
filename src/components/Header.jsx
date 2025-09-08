import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sword, Trophy, Coins } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-surface/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sword className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Faith Fighters Arena
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-accent" />
                <span>1,247</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coins className="h-4 w-4 text-accent" />
                <span>850</span>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}