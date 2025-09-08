import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import ContractService from '../contracts/FighterNFT';

// Game state structure
const initialState = {
  user: {
    address: null,
    fighters: [],
    tokenBalance: 0,
    xp: 0,
    wins: 0,
    losses: 0,
    rank: 'Bronze',
    achievements: []
  },
  game: {
    selectedFighter: null,
    currentMatch: null,
    matchHistory: [],
    leaderboard: [],
    marketplace: {
      listings: [],
      userListings: []
    }
  },
  ui: {
    loading: false,
    error: null,
    notifications: []
  }
};

// Action types
const ACTIONS = {
  SET_USER_ADDRESS: 'SET_USER_ADDRESS',
  SET_FIGHTERS: 'SET_FIGHTERS',
  UPDATE_FIGHTER: 'UPDATE_FIGHTER',
  ADD_FIGHTER: 'ADD_FIGHTER',
  SET_TOKEN_BALANCE: 'SET_TOKEN_BALANCE',
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  SET_SELECTED_FIGHTER: 'SET_SELECTED_FIGHTER',
  ADD_MATCH_RESULT: 'ADD_MATCH_RESULT',
  SET_MARKETPLACE_LISTINGS: 'SET_MARKETPLACE_LISTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER_ADDRESS:
      return {
        ...state,
        user: { ...state.user, address: action.payload }
      };

    case ACTIONS.SET_FIGHTERS:
      return {
        ...state,
        user: { ...state.user, fighters: action.payload }
      };

    case ACTIONS.UPDATE_FIGHTER:
      return {
        ...state,
        user: {
          ...state.user,
          fighters: state.user.fighters.map(fighter =>
            fighter.id === action.payload.id ? { ...fighter, ...action.payload } : fighter
          )
        }
      };

    case ACTIONS.ADD_FIGHTER:
      return {
        ...state,
        user: {
          ...state.user,
          fighters: [...state.user.fighters, action.payload]
        }
      };

    case ACTIONS.SET_TOKEN_BALANCE:
      return {
        ...state,
        user: { ...state.user, tokenBalance: action.payload }
      };

    case ACTIONS.UPDATE_USER_STATS:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case ACTIONS.SET_SELECTED_FIGHTER:
      return {
        ...state,
        game: { ...state.game, selectedFighter: action.payload }
      };

    case ACTIONS.ADD_MATCH_RESULT:
      const newStats = action.payload.won 
        ? { wins: state.user.wins + 1, xp: state.user.xp + action.payload.xpGained }
        : { losses: state.user.losses + 1, xp: state.user.xp + (action.payload.xpGained || 5) };

      return {
        ...state,
        user: { ...state.user, ...newStats },
        game: {
          ...state.game,
          matchHistory: [action.payload, ...state.game.matchHistory.slice(0, 9)]
        }
      };

    case ACTIONS.SET_MARKETPLACE_LISTINGS:
      return {
        ...state,
        game: {
          ...state.game,
          marketplace: { ...state.game.marketplace, listings: action.payload }
        }
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, { ...action.payload, id: Date.now() }]
        }
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };

    case ACTIONS.RESET_STATE:
      return initialState;

    default:
      return state;
  }
}

// Create context
const GameContext = createContext();

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Initialize contract service when wallet is connected
  const contractService = walletClient ? new ContractService(walletClient) : null;

  // Load user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      dispatch({ type: ACTIONS.SET_USER_ADDRESS, payload: address });
      loadUserData();
    } else {
      dispatch({ type: ACTIONS.RESET_STATE });
    }
  }, [isConnected, address]);

  // Load user fighters and token balance
  const loadUserData = async () => {
    if (!contractService || !address) return;

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      // Load fighters
      const fighters = await contractService.getFightersByOwner(address);
      dispatch({ type: ACTIONS.SET_FIGHTERS, payload: fighters });

      // Load token balance
      const balance = await contractService.getTokenBalance(address);
      dispatch({ type: ACTIONS.SET_TOKEN_BALANCE, payload: parseFloat(balance) });

      // Load user stats from localStorage (in a real app, this would be from a backend)
      const savedStats = localStorage.getItem(`user_stats_${address}`);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        dispatch({ type: ACTIONS.UPDATE_USER_STATS, payload: stats });
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load user data' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Mint a new fighter
  const mintFighter = async (fighterType, baseStats) => {
    if (!contractService) throw new Error('Wallet not connected');

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const receipt = await contractService.mintFighter(fighterType, baseStats);
      
      // Reload fighters after minting
      await loadUserData();
      
      dispatch({ 
        type: ACTIONS.ADD_NOTIFICATION, 
        payload: { 
          type: 'success', 
          message: 'Fighter minted successfully!',
          duration: 5000
        }
      });

      return receipt;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to mint fighter' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Upgrade fighter stat
  const upgradeFighterStat = async (tokenId, statIndex, amount) => {
    if (!contractService) throw new Error('Wallet not connected');

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const receipt = await contractService.upgradeStat(tokenId, statIndex, amount);
      
      // Reload fighters after upgrade
      await loadUserData();
      
      dispatch({ 
        type: ACTIONS.ADD_NOTIFICATION, 
        payload: { 
          type: 'success', 
          message: 'Fighter upgraded successfully!',
          duration: 5000
        }
      });

      return receipt;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to upgrade fighter' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Unlock fighter ability
  const unlockFighterAbility = async (tokenId, abilityId) => {
    if (!contractService) throw new Error('Wallet not connected');

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const receipt = await contractService.unlockAbility(tokenId, abilityId);
      
      // Reload fighters after unlock
      await loadUserData();
      
      dispatch({ 
        type: ACTIONS.ADD_NOTIFICATION, 
        payload: { 
          type: 'success', 
          message: 'New ability unlocked!',
          duration: 5000
        }
      });

      return receipt;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to unlock ability' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Record battle result
  const recordBattleResult = (battleData) => {
    dispatch({ type: ACTIONS.ADD_MATCH_RESULT, payload: battleData });
    
    // Save stats to localStorage
    const updatedStats = {
      xp: state.user.xp + (battleData.xpGained || 0),
      wins: battleData.won ? state.user.wins + 1 : state.user.wins,
      losses: battleData.won ? state.user.losses : state.user.losses + 1
    };
    
    localStorage.setItem(`user_stats_${address}`, JSON.stringify(updatedStats));
  };

  // Add notification
  const addNotification = (notification) => {
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notification.id });
      }, notification.duration);
    }
  };

  // Context value
  const value = {
    state,
    dispatch,
    actions: {
      mintFighter,
      upgradeFighterStat,
      unlockFighterAbility,
      recordBattleResult,
      addNotification,
      loadUserData
    },
    contractService
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
