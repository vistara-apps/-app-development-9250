import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Shield, Sword, Heart, Wind, Brain, Plus, Minus } from 'lucide-react';
import FighterCard from './FighterCard';
import { useGame } from '../context/GameContext';
import { ABILITIES } from '../data/gameData';

const STAT_ICONS = {
  health: Heart,
  attack: Sword,
  defense: Shield,
  speed: Wind,
  mana: Brain
};

const STAT_NAMES = {
  health: 'Health',
  attack: 'Attack',
  defense: 'Defense',
  speed: 'Speed',
  mana: 'Mana'
};

const UPGRADE_COSTS = {
  1: 0.0001, // 1 point = 0.0001 ETH
  5: 0.0004, // 5 points = 0.0004 ETH (20% discount)
  10: 0.0007 // 10 points = 0.0007 ETH (30% discount)
};

const ABILITY_UNLOCK_COST = 0.0005; // 0.0005 ETH per ability

export default function Training({ onBack }) {
  const { state, actions } = useGame();
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [upgradeAmounts, setUpgradeAmounts] = useState({
    health: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    mana: 0
  });
  const [selectedAbility, setSelectedAbility] = useState(null);

  const userFighters = state.user.fighters.filter(f => f.owned);

  const handleStatUpgrade = (stat, amount) => {
    setUpgradeAmounts(prev => ({
      ...prev,
      [stat]: Math.max(0, prev[stat] + amount)
    }));
  };

  const getTotalUpgradeCost = () => {
    const totalPoints = Object.values(upgradeAmounts).reduce((sum, amount) => sum + amount, 0);
    return totalPoints * UPGRADE_COSTS[1]; // Base cost per point
  };

  const handleApplyUpgrades = async () => {
    if (!selectedFighter) return;

    try {
      const totalCost = getTotalUpgradeCost();
      if (totalCost > state.user.tokenBalance) {
        actions.addNotification({
          type: 'error',
          message: 'Insufficient balance for upgrades',
          duration: 5000
        });
        return;
      }

      // Apply upgrades for each stat
      for (const [stat, amount] of Object.entries(upgradeAmounts)) {
        if (amount > 0) {
          const statIndex = Object.keys(STAT_NAMES).indexOf(stat);
          await actions.upgradeFighterStat(selectedFighter.tokenId, statIndex, amount);
        }
      }

      // Reset upgrade amounts
      setUpgradeAmounts({
        health: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        mana: 0
      });

      actions.addNotification({
        type: 'success',
        message: 'Fighter upgraded successfully!',
        duration: 5000
      });

    } catch (error) {
      console.error('Upgrade failed:', error);
      actions.addNotification({
        type: 'error',
        message: 'Upgrade failed. Please try again.',
        duration: 5000
      });
    }
  };

  const handleUnlockAbility = async (abilityId) => {
    if (!selectedFighter) return;

    try {
      if (ABILITY_UNLOCK_COST > state.user.tokenBalance) {
        actions.addNotification({
          type: 'error',
          message: 'Insufficient balance to unlock ability',
          duration: 5000
        });
        return;
      }

      await actions.unlockFighterAbility(selectedFighter.tokenId, abilityId);
      setSelectedAbility(null);

    } catch (error) {
      console.error('Ability unlock failed:', error);
      actions.addNotification({
        type: 'error',
        message: 'Failed to unlock ability. Please try again.',
        duration: 5000
      });
    }
  };

  const getAvailableAbilities = () => {
    if (!selectedFighter) return [];
    
    const currentAbilityIds = selectedFighter.abilities?.map(a => a.id) || [];
    return Object.values(ABILITIES).filter(ability => 
      !currentAbilityIds.includes(ability.id)
    );
  };

  const renderStatUpgrade = (stat) => {
    const Icon = STAT_ICONS[stat];
    const currentValue = selectedFighter?.stats?.[stat] || 0;
    const upgradeAmount = upgradeAmounts[stat];
    const newValue = currentValue + upgradeAmount;

    return (
      <div key={stat} className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-accent" />
            <div>
              <h4 className="font-semibold text-white">{STAT_NAMES[stat]}</h4>
              <p className="text-sm text-gray-400">
                {currentValue} → {newValue}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent">+{upgradeAmount}</p>
            <p className="text-xs text-gray-400">
              {(upgradeAmount * UPGRADE_COSTS[1]).toFixed(4)} ETH
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleStatUpgrade(stat, -1)}
            disabled={upgradeAmount === 0}
            className="btn-secondary p-2 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => handleStatUpgrade(stat, 1)}
              className="btn-primary px-3 py-1 text-sm"
            >
              +1
            </button>
            <button
              onClick={() => handleStatUpgrade(stat, 5)}
              className="btn-primary px-3 py-1 text-sm"
            >
              +5
            </button>
            <button
              onClick={() => handleStatUpgrade(stat, 10)}
              className="btn-primary px-3 py-1 text-sm"
            >
              +10
            </button>
          </div>

          <button
            onClick={() => handleStatUpgrade(stat, 1)}
            className="btn-secondary p-2"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Training Center</h1>
              <p className="text-gray-400">Upgrade your fighters and unlock new abilities</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Your Balance</p>
            <p className="text-lg font-semibold text-accent">
              {state.user.tokenBalance.toFixed(4)} ETH
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fighter Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Select Fighter</h2>
            
            {userFighters.length === 0 ? (
              <div className="card text-center py-8">
                <div className="text-4xl mb-4">⚔️</div>
                <p className="text-gray-400">No fighters available for training</p>
                <p className="text-sm text-gray-500 mt-2">
                  Acquire fighters from the marketplace first
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userFighters.map(fighter => (
                  <motion.div
                    key={fighter.id}
                    onClick={() => setSelectedFighter(fighter)}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedFighter?.id === fighter.id 
                        ? 'ring-2 ring-accent' 
                        : 'hover:shadow-glow'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FighterCard fighter={fighter} variant="small" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Training Options */}
          {selectedFighter && (
            <div className="lg:col-span-2 space-y-6">
              {/* Stat Upgrades */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Stat Upgrades</h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Total Cost</p>
                    <p className="text-lg font-bold text-accent">
                      {getTotalUpgradeCost().toFixed(4)} ETH
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {Object.keys(STAT_NAMES).map(renderStatUpgrade)}
                </div>

                <button
                  onClick={handleApplyUpgrades}
                  disabled={getTotalUpgradeCost() === 0 || state.ui.loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Zap className="h-5 w-5" />
                  <span>Apply Upgrades</span>
                </button>
              </div>

              {/* Ability Unlocks */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Unlock New Abilities</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {getAvailableAbilities().map(ability => (
                    <div key={ability.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{ability.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{ability.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          ability.type === 'attack' ? 'bg-red-500/20 text-red-400' :
                          ability.type === 'defense' ? 'bg-blue-500/20 text-blue-400' :
                          ability.type === 'magic' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {ability.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          {ability.damage && `Damage: ${ability.damage}`}
                          {ability.heal && `Heal: ${ability.heal}`}
                          {ability.shield && `Shield: ${ability.shield}`}
                          <br />
                          Cost: {ability.cost} mana
                        </div>
                        <button
                          onClick={() => handleUnlockAbility(ability.id)}
                          disabled={state.ui.loading}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Unlock
                          <br />
                          <span className="text-xs">{ABILITY_UNLOCK_COST} ETH</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {getAvailableAbilities().length === 0 && (
                  <div className="card text-center py-8">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-gray-400">All abilities unlocked!</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This fighter has mastered all available abilities
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
