import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from './config/wagmi';
import { GameProvider } from './context/GameContext';
import Header from './components/Header';
import FighterCard from './components/FighterCard';
import ArenaSelection from './components/ArenaSelection';
import FighterSelection from './components/FighterSelection';
import BattleArena from './components/BattleArena';
import Marketplace from './components/Marketplace';
import Training from './components/Training';
import Tournament from './components/Tournament';
import NotificationSystem from './components/NotificationSystem';
import GameStats from './components/GameStats';
import { SAMPLE_FIGHTERS, ARENA_MODES } from './data/gameData';
import { Swords, Shield, Zap, Trophy } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, arena-select, fighter-select, battle
  const [selectedArenaMode, setSelectedArenaMode] = useState(null);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [enemyFighter, setEnemyFighter] = useState(null);

  const handleEnterArena = () => {
    setCurrentView('arena-select');
  };

  const handleSelectArenaMode = (mode) => {
    setSelectedArenaMode(mode);
    setCurrentView('fighter-select');
  };

  const handleSelectFighter = (fighter) => {
    setSelectedFighter(fighter);
    // Generate random enemy fighter
    const availableEnemies = SAMPLE_FIGHTERS.filter(f => f.id !== fighter.id);
    const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    setEnemyFighter(randomEnemy);
    setCurrentView('battle');
  };

  const handleBattleEnd = (won) => {
    // Handle battle rewards and state updates
    console.log('Battle ended, won:', won);
  };

  const handleExitBattle = () => {
    setCurrentView('home');
    setSelectedFighter(null);
    setEnemyFighter(null);
    setSelectedArenaMode(null);
  };

  const renderHomeView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-surface/50 to-primary/20 rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-bold text-white">Welcome to the Arena</h2>
          <p className="text-xl text-gray-300">Train your fighters, battle opponents, and claim victory!</p>
          
          <div className="flex justify-center space-x-6 mt-6">
            <motion.button
              onClick={handleEnterArena}
              className="btn-primary flex items-center space-x-3 text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Swords className="h-6 w-6" />
              <span>Enter Arena</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <GameStats />

      {/* Featured Fighters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Your Fighters</h3>
          <button className="btn-secondary">Manage Collection</button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_FIGHTERS.filter(f => f.owned).map(fighter => (
            <FighterCard key={fighter.id} fighter={fighter} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          className="card text-center cursor-pointer hover:shadow-glow"
          whileHover={{ y: -5 }}
          onClick={handleEnterArena}
        >
          <Swords className="h-12 w-12 text-accent mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">Quick Battle</h4>
          <p className="text-gray-400 text-sm">Jump into a casual match</p>
        </motion.div>

        <motion.div
          className="card text-center cursor-pointer hover:shadow-glow"
          whileHover={{ y: -5 }}
          onClick={() => setCurrentView('training')}
        >
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">Training</h4>
          <p className="text-gray-400 text-sm">Improve your fighters</p>
        </motion.div>

        <motion.div
          className="card text-center cursor-pointer hover:shadow-glow"
          whileHover={{ y: -5 }}
          onClick={() => setCurrentView('marketplace')}
        >
          <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">Marketplace</h4>
          <p className="text-gray-400 text-sm">Buy and sell fighters</p>
        </motion.div>

        <motion.div
          className="card text-center cursor-pointer hover:shadow-glow"
          whileHover={{ y: -5 }}
          onClick={() => setCurrentView('tournament')}
        >
          <Trophy className="h-12 w-12 text-success mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">Tournaments</h4>
          <p className="text-gray-400 text-sm">Compete for glory</p>
        </motion.div>
      </div>
    </div>
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <GameProvider>
            <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
              <Header />
              
              <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderHomeView()}
            </motion.div>
          )}

          {currentView === 'arena-select' && (
            <motion.div
              key="arena-select"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ArenaSelection
                onSelectMode={handleSelectArenaMode}
                onBack={() => setCurrentView('home')}
              />
            </motion.div>
          )}

          {currentView === 'fighter-select' && (
            <motion.div
              key="fighter-select"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <FighterSelection
                fighters={SAMPLE_FIGHTERS}
                onSelectFighter={handleSelectFighter}
                onBack={() => setCurrentView('arena-select')}
                selectedArenaMode={selectedArenaMode}
              />
            </motion.div>
          )}

          {currentView === 'battle' && selectedFighter && enemyFighter && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BattleArena
                playerFighter={selectedFighter}
                enemyFighter={enemyFighter}
                onExit={handleExitBattle}
                onBattleEnd={handleBattleEnd}
              />
            </motion.div>
          )}

          {currentView === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Marketplace onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Training onBack={() => setCurrentView('home')} />
            </motion.div>
          )}

          {currentView === 'tournament' && (
            <motion.div
              key="tournament"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Tournament onBack={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
              </main>
              
              <NotificationSystem />
            </div>
          </GameProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
