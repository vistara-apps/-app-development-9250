import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Star } from 'lucide-react';

export default function GameStats() {
  const stats = [
    { label: 'Total Wins', value: '247', icon: Trophy, color: 'text-accent' },
    { label: 'Win Rate', value: '73%', icon: Target, color: 'text-success' },
    { label: 'Battle Streak', value: '12', icon: Flame, color: 'text-danger' },
    { label: 'Arena Rank', value: '#1,847', icon: Star, color: 'text-primary' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}