import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Clock, Coins, Star, Crown } from 'lucide-react';
import FighterCard from './FighterCard';
import { useGame } from '../context/GameContext';

// Mock tournament data
const MOCK_TOURNAMENTS = [
  {
    id: 'tournament_1',
    name: 'Weekly Champions Cup',
    description: 'Compete against the best fighters for ultimate glory',
    entryFee: 0.005,
    prizePool: 0.1,
    maxParticipants: 16,
    currentParticipants: 12,
    startTime: Date.now() + 3600000, // 1 hour from now
    duration: 7200000, // 2 hours
    status: 'registration',
    rounds: [
      { name: 'Quarter Finals', matches: 4 },
      { name: 'Semi Finals', matches: 2 },
      { name: 'Finals', matches: 1 }
    ],
    rewards: {
      first: { tokens: 50, nft: 'Legendary Champion Badge', eth: 0.05 },
      second: { tokens: 30, nft: 'Epic Runner-up Badge', eth: 0.03 },
      third: { tokens: 20, nft: 'Rare Participant Badge', eth: 0.02 }
    }
  },
  {
    id: 'tournament_2',
    name: 'Rookie Arena',
    description: 'Perfect for new fighters to prove themselves',
    entryFee: 0.001,
    prizePool: 0.02,
    maxParticipants: 8,
    currentParticipants: 6,
    startTime: Date.now() + 1800000, // 30 minutes from now
    duration: 3600000, // 1 hour
    status: 'registration',
    rounds: [
      { name: 'Semi Finals', matches: 2 },
      { name: 'Finals', matches: 1 }
    ],
    rewards: {
      first: { tokens: 15, nft: 'Rookie Champion Badge', eth: 0.01 },
      second: { tokens: 10, nft: 'Rookie Runner-up Badge', eth: 0.006 },
      third: { tokens: 5, nft: 'Rookie Participant Badge', eth: 0.004 }
    }
  },
  {
    id: 'tournament_3',
    name: 'Masters League',
    description: 'Elite tournament for legendary fighters only',
    entryFee: 0.01,
    prizePool: 0.2,
    maxParticipants: 32,
    currentParticipants: 28,
    startTime: Date.now() - 1800000, // Started 30 minutes ago
    duration: 10800000, // 3 hours
    status: 'active',
    rounds: [
      { name: 'Round of 16', matches: 8 },
      { name: 'Quarter Finals', matches: 4 },
      { name: 'Semi Finals', matches: 2 },
      { name: 'Finals', matches: 1 }
    ],
    rewards: {
      first: { tokens: 100, nft: 'Master Champion Crown', eth: 0.1 },
      second: { tokens: 60, nft: 'Master Runner-up Medal', eth: 0.06 },
      third: { tokens: 40, nft: 'Master Bronze Medal', eth: 0.04 }
    }
  }
];

export default function Tournament({ onBack }) {
  const { state, actions } = useGame();
  const [tournaments, setTournaments] = useState(MOCK_TOURNAMENTS);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedFighter, setSelectedFighter] = useState(null);

  const userFighters = state.user.fighters.filter(f => f.owned);

  const formatTimeUntil = (timestamp) => {
    const diff = timestamp - Date.now();
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registration': return 'text-green-400';
      case 'active': return 'text-yellow-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'registration': return Users;
      case 'active': return Clock;
      case 'completed': return Trophy;
      default: return Clock;
    }
  };

  const handleJoinTournament = async (tournament) => {
    if (!selectedFighter) {
      actions.addNotification({
        type: 'error',
        message: 'Please select a fighter first',
        duration: 3000
      });
      return;
    }

    if (tournament.entryFee > state.user.tokenBalance) {
      actions.addNotification({
        type: 'error',
        message: 'Insufficient balance for entry fee',
        duration: 5000
      });
      return;
    }

    try {
      // In a real app, this would interact with the tournament smart contract
      actions.addNotification({
        type: 'success',
        message: `Successfully joined ${tournament.name}!`,
        duration: 5000
      });

      // Update tournament participants (mock)
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id 
          ? { ...t, currentParticipants: t.currentParticipants + 1 }
          : t
      ));

    } catch (error) {
      actions.addNotification({
        type: 'error',
        message: 'Failed to join tournament',
        duration: 5000
      });
    }
  };

  const renderTournamentCard = (tournament) => {
    const StatusIcon = getStatusIcon(tournament.status);
    const participationRate = (tournament.currentParticipants / tournament.maxParticipants) * 100;

    return (
      <motion.div
        key={tournament.id}
        className="card hover:shadow-glow transition-all duration-300 cursor-pointer"
        onClick={() => setSelectedTournament(tournament)}
        whileHover={{ y: -5 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
            <p className="text-gray-400 text-sm">{tournament.description}</p>
          </div>
          <div className={`flex items-center space-x-1 ${getStatusColor(tournament.status)}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-semibold capitalize">{tournament.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400">Entry Fee</p>
            <p className="text-lg font-bold text-accent">{tournament.entryFee} ETH</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Prize Pool</p>
            <p className="text-lg font-bold text-success">{tournament.prizePool} ETH</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Participants</span>
            <span className="text-white">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-bg rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${participationRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="text-gray-400">
              {tournament.status === 'registration' ? 'Starts in' : 
               tournament.status === 'active' ? 'Time left' : 'Completed'}
            </p>
            <p className="text-white font-semibold">
              {tournament.status !== 'completed' && formatTimeUntil(tournament.startTime)}
            </p>
          </div>
          <Trophy className="h-6 w-6 text-accent" />
        </div>
      </motion.div>
    );
  };

  const renderTournamentDetails = () => {
    if (!selectedTournament) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedTournament.name}</h2>
              <p className="text-gray-400">{selectedTournament.description}</p>
            </div>
            <button
              onClick={() => setSelectedTournament(null)}
              className="btn-secondary"
            >
              Back to List
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <Coins className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{selectedTournament.entryFee} ETH</p>
              <p className="text-sm text-gray-400">Entry Fee</p>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{selectedTournament.prizePool} ETH</p>
              <p className="text-sm text-gray-400">Prize Pool</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {selectedTournament.currentParticipants}/{selectedTournament.maxParticipants}
              </p>
              <p className="text-sm text-gray-400">Participants</p>
            </div>
          </div>

          {/* Tournament Rounds */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tournament Structure</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {selectedTournament.rounds.map((round, index) => (
                <div key={index} className="bg-surface/50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-white mb-2">{round.name}</h4>
                  <p className="text-accent text-lg font-bold">{round.matches}</p>
                  <p className="text-xs text-gray-400">matches</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rewards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(selectedTournament.rewards).map(([place, reward]) => (
                <div key={place} className="bg-surface/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    {place === 'first' && <Crown className="h-5 w-5 text-yellow-400" />}
                    {place === 'second' && <Star className="h-5 w-5 text-gray-300" />}
                    {place === 'third' && <Star className="h-5 w-5 text-amber-600" />}
                    <h4 className="font-semibold text-white capitalize">{place} Place</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-accent">{reward.eth} ETH</p>
                    <p className="text-primary">{reward.tokens} Tokens</p>
                    <p className="text-gray-400 text-xs">{reward.nft}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fighter Selection & Join */}
          {selectedTournament.status === 'registration' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select Your Fighter</h3>
              
              {userFighters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⚔️</div>
                  <p className="text-gray-400">No fighters available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Acquire fighters from the marketplace first
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
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

                  <button
                    onClick={() => handleJoinTournament(selectedTournament)}
                    disabled={!selectedFighter || state.ui.loading}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Trophy className="h-5 w-5" />
                    <span>Join Tournament ({selectedTournament.entryFee} ETH)</span>
                  </button>
                </>
              )}
            </div>
          )}

          {selectedTournament.status === 'active' && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Tournament in Progress</h3>
              <p className="text-gray-400">Check back later for results</p>
            </div>
          )}
        </div>
      </motion.div>
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
              <h1 className="text-3xl font-bold text-white">Tournaments</h1>
              <p className="text-gray-400">Compete in epic battles for glory and rewards</p>
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
          {/* Tournament List */}
          <div className={`space-y-4 ${selectedTournament ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <h2 className="text-xl font-semibold text-white">Available Tournaments</h2>
            
            <div className={`grid gap-4 ${selectedTournament ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
              {tournaments.map(renderTournamentCard)}
            </div>
          </div>

          {/* Tournament Details */}
          {selectedTournament && (
            <div className="lg:col-span-2">
              {renderTournamentDetails()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
