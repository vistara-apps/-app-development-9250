import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Trophy, Crown, Users, ArrowRight } from 'lucide-react';
import { ARENA_MODES } from '../data/gameData';
import { usePaymentContext } from '../hooks/usePaymentContext';

const modeIcons = {
  casual: Users,
  ranked: Trophy,
  tournament: Crown
};

export default function ArenaSelection({ onSelectMode, onBack }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createSession } = usePaymentContext();

  const handleEnterArena = async (mode) => {
    setIsLoading(true);
    
    try {
      // If there's an entry fee, process payment
      if (mode.entryFee > 0) {
        await createSession(`$${mode.entryFee}`);
      }
      
      onSelectMode(mode);
    } catch (error) {
      console.error('Failed to enter arena:', error);
      // Handle payment failure - show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Choose Your Arena</h2>
        <p className="text-gray-400">Select a battle mode and prove your worth</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.values(ARENA_MODES).map((mode) => {
          const Icon = modeIcons[mode.id];
          return (
            <motion.div
              key={mode.id}
              className={`card cursor-pointer transition-all duration-300 ${
                selectedMode?.id === mode.id ? 'ring-2 ring-accent shadow-glow' : ''
              }`}
              onClick={() => setSelectedMode(mode)}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Icon className="h-12 w-12 text-accent" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{mode.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{mode.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">
                      {mode.entryFee > 0 ? `${mode.entryFee} ETH` : 'Free'}
                    </div>
                    <div className="text-xs text-gray-400">Entry Fee</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-white">Rewards:</div>
                    <div className="text-xs space-y-1 text-gray-300">
                      <div>• {mode.rewards.xp} XP</div>
                      <div>• {mode.rewards.tokens} Tokens</div>
                      {mode.rewards.nft && <div>• {mode.rewards.nft}% NFT Drop Chance</div>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="card bg-primary/10 border-primary">
            <h3 className="text-lg font-semibold text-white mb-2">
              Ready to enter {selectedMode.name}?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {selectedMode.entryFee > 0 
                ? `This will cost ${selectedMode.entryFee} ETH. Payment will be processed securely.`
                : 'This is a free arena mode. No payment required.'
              }
            </p>
            
            <div className="flex space-x-3 justify-center">
              <button
                onClick={onBack}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={() => handleEnterArena(selectedMode)}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Enter Arena</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}