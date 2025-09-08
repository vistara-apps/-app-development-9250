import { motion } from 'framer-motion';
import { Star, Zap, Shield, Heart } from 'lucide-react';

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500'
};

export default function FighterCard({ fighter, variant = 'default', onClick, selected = false }) {
  const isSmall = variant === 'small';
  const isBattle = variant === 'battle';
  
  return (
    <motion.div
      className={`fighter-card relative overflow-hidden ${
        selected ? 'ring-2 ring-accent shadow-glow' : ''
      } ${isSmall ? 'p-4' : 'p-6'}`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rarity Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[fighter.rarity]} opacity-10`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-semibold ${isSmall ? 'text-sm' : 'text-lg'} text-white`}>
              {fighter.name}
            </h3>
            <p className={`text-primary ${isSmall ? 'text-xs' : 'text-sm'} capitalize`}>
              {fighter.type} • Level {fighter.level}
            </p>
          </div>
          <div className={`${isSmall ? 'text-2xl' : 'text-4xl'}`}>
            {fighter.image}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {!isSmall && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span>{fighter.stats.health}/{fighter.stats.maxHealth}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span>{fighter.stats.mana}/{fighter.stats.maxMana}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sword className="h-4 w-4 text-yellow-400" />
                <span>{fighter.stats.attack}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>{fighter.stats.defense}</span>
              </div>
            </div>
          )}

          {/* Health Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Health</span>
              <span>{fighter.stats.health}/{fighter.stats.maxHealth}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-fill from-red-500 to-red-400"
                style={{ width: `${(fighter.stats.health / fighter.stats.maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Mana</span>
              <span>{fighter.stats.mana}/{fighter.stats.maxMana}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-fill from-blue-500 to-blue-400"
                style={{ width: `${(fighter.stats.mana / fighter.stats.maxMana) * 100}%` }}
              />
            </div>
          </div>

          {/* Rarity Badge */}
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-gradient-to-r ${rarityColors[fighter.rarity]}`}>
              <Star className="h-3 w-3" />
              <span className="capitalize">{fighter.rarity}</span>
            </div>
            {!fighter.owned && (
              <span className="text-xs text-gray-400">Not Owned</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}