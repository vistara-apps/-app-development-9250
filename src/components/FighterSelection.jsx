import { useState } from 'react';
import { motion } from 'framer-motion';
import FighterCard from './FighterCard';
import { ArrowLeft, Swords } from 'lucide-react';

export default function FighterSelection({ fighters, onSelectFighter, onBack, selectedArenaMode }) {
  const [selectedFighter, setSelectedFighter] = useState(null);
  
  const ownedFighters = fighters.filter(f => f.owned);

  const handleStartBattle = () => {
    if (selectedFighter) {
      onSelectFighter(selectedFighter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Arenas</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Choose Your Fighter</h2>
          <p className="text-gray-400">Arena: {selectedArenaMode?.name}</p>
        </div>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {ownedFighters.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Fighters Available</h3>
          <p className="text-gray-400 mb-6">You need to acquire at least one fighter to battle.</p>
          <button className="btn-primary">Browse Marketplace</button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedFighters.map(fighter => (
              <FighterCard
                key={fighter.id}
                fighter={fighter}
                onClick={() => setSelectedFighter(fighter)}
                selected={selectedFighter?.id === fighter.id}
              />
            ))}
          </div>

          {selectedFighter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="card bg-accent/10 border-accent">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedFighter.name} is ready for battle!
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Level {selectedFighter.level} {selectedFighter.type} • {selectedFighter.rarity} rarity
                </p>
                
                <button
                  onClick={handleStartBattle}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Swords className="h-4 w-4" />
                  <span>Start Battle</span>
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}