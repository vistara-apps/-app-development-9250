import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Tag, TrendingUp, Filter, Search } from 'lucide-react';
import FighterCard from './FighterCard';
import { useGame } from '../context/GameContext';
import { FIGHTER_TYPES } from '../data/gameData';

// Mock marketplace data (in a real app, this would come from a backend/smart contract)
const MOCK_LISTINGS = [
  {
    id: 'listing_1',
    fighter: {
      id: 'market_fighter_1',
      name: 'Lightning Striker',
      type: FIGHTER_TYPES.ASSASSIN,
      level: 8,
      stats: {
        health: 110,
        maxHealth: 110,
        mana: 90,
        maxMana: 90,
        attack: 45,
        defense: 22,
        speed: 40
      },
      rarity: 'legendary',
      image: '⚡',
      owned: false
    },
    price: 0.05,
    seller: '0x1234...5678',
    listedAt: Date.now() - 86400000 // 1 day ago
  },
  {
    id: 'listing_2',
    fighter: {
      id: 'market_fighter_2',
      name: 'Frost Guardian',
      type: FIGHTER_TYPES.PALADIN,
      level: 6,
      stats: {
        health: 140,
        maxHealth: 140,
        mana: 70,
        maxMana: 70,
        attack: 30,
        defense: 35,
        speed: 18
      },
      rarity: 'epic',
      image: '❄️',
      owned: false
    },
    price: 0.03,
    seller: '0x9876...4321',
    listedAt: Date.now() - 172800000 // 2 days ago
  },
  {
    id: 'listing_3',
    fighter: {
      id: 'market_fighter_3',
      name: 'Ember Mage',
      type: FIGHTER_TYPES.MAGE,
      level: 7,
      stats: {
        health: 95,
        maxHealth: 95,
        mana: 130,
        maxMana: 130,
        attack: 50,
        defense: 18,
        speed: 28
      },
      rarity: 'rare',
      image: '🔥',
      owned: false
    },
    price: 0.025,
    seller: '0x5555...7777',
    listedAt: Date.now() - 43200000 // 12 hours ago
  }
];

export default function Marketplace({ onBack }) {
  const { state, actions } = useGame();
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [filteredListings, setFilteredListings] = useState(MOCK_LISTINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort listings
  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.fighter.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(listing => listing.fighter.type === selectedType);
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'level_high':
        filtered.sort((a, b) => b.fighter.level - a.fighter.level);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.listedAt - a.listedAt);
        break;
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, selectedType, sortBy]);

  const handlePurchase = async (listing) => {
    try {
      // In a real app, this would interact with the marketplace smart contract
      actions.addNotification({
        type: 'info',
        message: 'Purchase functionality coming soon!',
        duration: 3000
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        message: 'Failed to purchase fighter',
        duration: 5000
      });
    }
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
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
              <h1 className="text-3xl font-bold text-white">Fighter Marketplace</h1>
              <p className="text-gray-400">Buy and sell unique NFT fighters</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Your Balance</p>
              <p className="text-lg font-semibold text-accent">
                {state.user.tokenBalance.toFixed(4)} ETH
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fighters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-bg border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value={FIGHTER_TYPES.WARRIOR}>Warrior</option>
              <option value={FIGHTER_TYPES.MAGE}>Mage</option>
              <option value={FIGHTER_TYPES.ASSASSIN}>Assassin</option>
              <option value={FIGHTER_TYPES.PALADIN}>Paladin</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-bg border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="level_high">Level: High to Low</option>
            </select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <ShoppingCart className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{listings.length}</p>
            <p className="text-sm text-gray-400">Listed Fighters</p>
          </div>
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0.035</p>
            <p className="text-sm text-gray-400">Avg Price (ETH)</p>
          </div>
          <div className="card text-center">
            <Tag className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-sm text-gray-400">Sales Today</p>
          </div>
          <div className="card text-center">
            <Filter className="h-8 w-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{filteredListings.length}</p>
            <p className="text-sm text-gray-400">Filtered Results</p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card hover:shadow-glow transition-all duration-300"
              >
                {/* Fighter Card */}
                <div className="mb-4">
                  <FighterCard fighter={listing.fighter} variant="small" />
                </div>

                {/* Listing Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${getRarityColor(listing.fighter.rarity)}`}>
                      {listing.fighter.rarity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(listing.listedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-accent">{listing.price} ETH</p>
                      <p className="text-xs text-gray-400">
                        by {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(listing)}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                    disabled={state.ui.loading}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No fighters found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
