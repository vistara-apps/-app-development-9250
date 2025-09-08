import { motion } from 'framer-motion';
import { Zap, Shield, Heart, Sword } from 'lucide-react';

const abilityIcons = {
  attack: Sword,
  magic: Zap,
  defense: Shield,
  support: Heart,
  stealth: Sword
};

const abilityColors = {
  attack: 'from-red-500 to-red-600',
  magic: 'from-purple-500 to-purple-600',
  defense: 'from-blue-500 to-blue-600',
  support: 'from-green-500 to-green-600',
  stealth: 'from-gray-500 to-gray-600'
};

export default function AbilityButton({ ability, onClick, disabled = false, canAfford = true }) {
  const Icon = abilityIcons[ability.type] || Zap;
  
  return (
    <motion.button
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
      } ${
        canAfford 
          ? `bg-gradient-to-br ${abilityColors[ability.type]} border-white/20 shadow-lg` 
          : 'bg-gray-600 border-gray-500'
      }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <div className="flex flex-col items-center space-y-2 text-white">
        <Icon className="h-6 w-6" />
        <div className="text-center">
          <div className="font-semibold text-sm">{ability.name}</div>
          <div className="text-xs opacity-80">Cost: {ability.cost}</div>
          {ability.damage && (
            <div className="text-xs text-red-300">DMG: {ability.damage}</div>
          )}
          {ability.heal && (
            <div className="text-xs text-green-300">HEAL: {ability.heal}</div>
          )}
          {ability.shield && (
            <div className="text-xs text-blue-300">SHIELD: {ability.shield}</div>
          )}
        </div>
      </div>
    </motion.button>
  );
}