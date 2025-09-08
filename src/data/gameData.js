// Mock data for fighters, abilities, and game state
export const FIGHTER_TYPES = {
  WARRIOR: 'warrior',
  MAGE: 'mage', 
  ASSASSIN: 'assassin',
  PALADIN: 'paladin'
};

export const ABILITIES = {
  SWORD_STRIKE: {
    id: 'sword_strike',
    name: 'Sword Strike',
    description: 'A powerful melee attack',
    damage: 25,
    cost: 10,
    type: 'attack'
  },
  FIREBALL: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Magical fire damage',
    damage: 30,
    cost: 15,
    type: 'magic'
  },
  STEALTH_STRIKE: {
    id: 'stealth_strike',
    name: 'Stealth Strike',
    description: 'Critical hit from shadows',
    damage: 35,
    cost: 12,
    type: 'stealth'
  },
  DIVINE_SHIELD: {
    id: 'divine_shield',
    name: 'Divine Shield',
    description: 'Protective holy barrier',
    shield: 20,
    cost: 8,
    type: 'defense'
  },
  HEAL: {
    id: 'heal',
    name: 'Heal',
    description: 'Restore health points',
    heal: 20,
    cost: 12,
    type: 'support'
  }
};

export const SAMPLE_FIGHTERS = [
  {
    id: 'fighter_1',
    name: 'Crimson Warrior',
    type: FIGHTER_TYPES.WARRIOR,
    level: 5,
    stats: {
      health: 120,
      maxHealth: 120,
      mana: 80,
      maxMana: 80,
      attack: 35,
      defense: 25,
      speed: 20
    },
    abilities: [ABILITIES.SWORD_STRIKE, ABILITIES.HEAL],
    rarity: 'epic',
    image: '⚔️',
    owned: true
  },
  {
    id: 'fighter_2', 
    name: 'Mystic Flame',
    type: FIGHTER_TYPES.MAGE,
    level: 4,
    stats: {
      health: 90,
      maxHealth: 90,
      mana: 120,
      maxMana: 120,
      attack: 45,
      defense: 15,
      speed: 25
    },
    abilities: [ABILITIES.FIREBALL, ABILITIES.DIVINE_SHIELD],
    rarity: 'rare',
    image: '🔥',
    owned: true
  },
  {
    id: 'fighter_3',
    name: 'Shadow Blade',
    type: FIGHTER_TYPES.ASSASSIN,
    level: 6,
    stats: {
      health: 100,
      maxHealth: 100,
      mana: 100,
      maxMana: 100,
      attack: 40,
      defense: 20,
      speed: 35
    },
    abilities: [ABILITIES.STEALTH_STRIKE, ABILITIES.SWORD_STRIKE],
    rarity: 'legendary',
    image: '🗡️',
    owned: false
  }
];

export const ARENA_MODES = {
  CASUAL: {
    id: 'casual',
    name: 'Casual Arena',
    description: 'Practice battles with no stakes',
    entryFee: 0,
    rewards: { xp: 10, tokens: 5 }
  },
  RANKED: {
    id: 'ranked',
    name: 'Ranked Arena',
    description: 'Competitive matches for glory',
    entryFee: 0.001,
    rewards: { xp: 25, tokens: 15, nft: 0.1 }
  },
  TOURNAMENT: {
    id: 'tournament',
    name: 'Weekly Tournament',
    description: 'High stakes elimination rounds',
    entryFee: 0.005,
    rewards: { xp: 100, tokens: 50, nft: 0.3 }
  }
};