import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FighterCard from './FighterCard';
import AbilityButton from './AbilityButton';
import { ArrowLeft, Trophy, Skull } from 'lucide-react';

export default function BattleArena({ playerFighter, enemyFighter, onExit, onBattleEnd }) {
  const [currentTurn, setCurrentTurn] = useState('player');
  const [battleLog, setBattleLog] = useState([]);
  const [battleState, setBattleState] = useState('active'); // active, won, lost
  const [playerFighterState, setPlayerFighterState] = useState({ ...playerFighter });
  const [enemyFighterState, setEnemyFighterState] = useState({ ...enemyFighter });

  const addToBattleLog = (message) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const executeAbility = (ability, isPlayer = true) => {
    const attacker = isPlayer ? playerFighterState : enemyFighterState;
    const defender = isPlayer ? enemyFighterState : playerFighterState;
    const setAttacker = isPlayer ? setPlayerFighterState : setEnemyFighterState;
    const setDefender = isPlayer ? setEnemyFighterState : setPlayerFighterState;

    // Check if attacker has enough mana
    if (attacker.stats.mana < ability.cost) {
      addToBattleLog(`${attacker.name} doesn't have enough mana!`);
      return;
    }

    // Deduct mana cost
    setAttacker(prev => ({
      ...prev,
      stats: { ...prev.stats, mana: prev.stats.mana - ability.cost }
    }));

    let message = `${attacker.name} uses ${ability.name}!`;

    if (ability.damage) {
      const damage = Math.max(1, ability.damage - defender.stats.defense);
      setDefender(prev => ({
        ...prev,
        stats: { ...prev.stats, health: Math.max(0, prev.stats.health - damage) }
      }));
      message += ` Deals ${damage} damage!`;
    }

    if (ability.heal) {
      setAttacker(prev => ({
        ...prev,
        stats: { 
          ...prev.stats, 
          health: Math.min(prev.stats.maxHealth, prev.stats.health + ability.heal) 
        }
      }));
      message += ` Heals for ${ability.heal}!`;
    }

    if (ability.shield) {
      setAttacker(prev => ({
        ...prev,
        stats: { 
          ...prev.stats, 
          defense: prev.stats.defense + ability.shield 
        }
      }));
      message += ` Gains ${ability.shield} defense!`;
    }

    addToBattleLog(message);
    setCurrentTurn(isPlayer ? 'enemy' : 'player');
  };

  // AI enemy turn
  useEffect(() => {
    if (currentTurn === 'enemy' && battleState === 'active') {
      const timer = setTimeout(() => {
        const availableAbilities = enemyFighterState.abilities.filter(
          ability => enemyFighterState.stats.mana >= ability.cost
        );
        
        if (availableAbilities.length > 0) {
          const randomAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
          executeAbility(randomAbility, false);
        } else {
          addToBattleLog(`${enemyFighterState.name} is out of mana!`);
          setCurrentTurn('player');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, battleState]);

  // Check for battle end
  useEffect(() => {
    if (playerFighterState.stats.health <= 0) {
      setBattleState('lost');
      addToBattleLog('Defeat! Your fighter has fallen!');
      onBattleEnd?.(false);
    } else if (enemyFighterState.stats.health <= 0) {
      setBattleState('won');
      addToBattleLog('Victory! You have won the battle!');
      onBattleEnd?.(true);
    }
  }, [playerFighterState.stats.health, enemyFighterState.stats.health]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exit Battle</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Battle Arena</h2>
            <div className={`text-lg font-semibold ${
              currentTurn === 'player' ? 'text-accent' : 'text-primary'
            }`}>
              {battleState === 'active' 
                ? `${currentTurn === 'player' ? 'Your' : 'Enemy'} Turn`
                : battleState === 'won' ? 'Victory!' : 'Defeat!'
              }
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {battleState === 'won' && <Trophy className="h-6 w-6 text-accent" />}
            {battleState === 'lost' && <Skull className="h-6 w-6 text-danger" />}
          </div>
        </div>

        {/* Battle Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Player Fighter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">Your Fighter</h3>
            <FighterCard fighter={playerFighterState} variant="battle" />
            
            {/* Player Abilities */}
            {currentTurn === 'player' && battleState === 'active' && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Choose Ability:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {playerFighterState.abilities.map(ability => (
                    <AbilityButton
                      key={ability.id}
                      ability={ability}
                      onClick={() => executeAbility(ability, true)}
                      canAfford={playerFighterState.stats.mana >= ability.cost}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Battle Log */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary text-center">Battle Log</h3>
            <div className="card min-h-[300px] bg-bg/50">
              <div className="space-y-2">
                <AnimatePresence>
                  {battleLog.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-sm text-gray-300 p-2 bg-surface/30 rounded"
                    >
                      {message}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Battle End Actions */}
            {battleState !== 'active' && (
              <div className="space-y-3">
                <div className="text-center">
                  {battleState === 'won' ? (
                    <div className="text-success">
                      <p className="font-semibold">Victory Rewards:</p>
                      <p className="text-sm">+25 XP, +15 Tokens</p>
                    </div>
                  ) : (
                    <div className="text-danger">
                      <p className="font-semibold">Better luck next time!</p>
                      <p className="text-sm">+5 XP for participation</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onExit}
                  className="btn-primary w-full"
                >
                  Return to Arena
                </button>
              </div>
            )}
          </div>

          {/* Enemy Fighter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-danger">Enemy Fighter</h3>
            <FighterCard fighter={enemyFighterState} variant="battle" />
            
            {/* Enemy Abilities Display */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Enemy Abilities:</h4>
              <div className="grid grid-cols-1 gap-2">
                {enemyFighterState.abilities.map(ability => (
                  <div key={ability.id} className="p-2 bg-surface/30 rounded text-xs">
                    <div className="font-semibold">{ability.name}</div>
                    <div className="text-gray-400">{ability.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}