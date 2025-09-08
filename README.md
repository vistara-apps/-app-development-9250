# Faith Fighters Arena

A web3 battle arena game on Base where users can acquire, customize, and battle with NFT fighters, engaging in matchmaking and earning rewards.

## 🎮 Features

### Core Features
- **NFT Fighter Acquisition**: Mint and own unique NFT fighters with distinct attributes
- **Battle System**: Turn-based combat with strategic ability usage
- **Training Center**: Upgrade fighter stats and unlock new abilities
- **Marketplace**: Buy and sell fighters with other players
- **Tournament Mode**: Compete in structured tournaments for rewards
- **Reward System**: Earn tokens and NFTs for victories

### Technical Features
- **Base Network Integration**: Built on Base blockchain for fast, low-cost transactions
- **Smart Contract Integration**: NFT minting, stat upgrades, and ability unlocks
- **Wallet Connection**: RainbowKit integration for seamless wallet connectivity
- **Real-time Notifications**: Toast-style notifications for user feedback
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Framer Motion for enhanced user experience

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, RainbowKit, Viem
- **Blockchain**: Base Network
- **State Management**: React Context + useReducer
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd faith-fighters-arena
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Game Mechanics

### Fighter Types
- **Warrior**: High health and defense, moderate attack
- **Mage**: High mana and magical damage, low defense
- **Assassin**: High speed and critical damage, low health
- **Paladin**: Balanced stats with healing abilities

### Battle System
- Turn-based combat with mana management
- Abilities have different costs and effects:
  - **Attack abilities**: Deal damage to opponents
  - **Defense abilities**: Increase defense or provide shields
  - **Healing abilities**: Restore health
  - **Magic abilities**: Special effects and high damage

### Progression
- **Stat Upgrades**: Spend ETH to permanently increase fighter stats
- **Ability Unlocks**: Purchase new abilities for strategic depth
- **Experience System**: Gain XP from battles to unlock features
- **Ranking System**: Climb leaderboards through victories

## 💰 Economy

### Costs
- **Fighter Minting**: 0.001 ETH
- **Stat Upgrades**: 0.0001 ETH per point
- **Ability Unlocks**: 0.0005 ETH per ability
- **Tournament Entry**: Variable (0.001 - 0.01 ETH)

### Rewards
- **Battle Victories**: 15-25 XP + tokens
- **Tournament Wins**: ETH prizes + exclusive NFTs
- **Achievements**: Special badges and bonuses

## 🏗 Architecture

### Smart Contracts
- **FighterNFT**: ERC-721 contract for fighter ownership
- **GameToken**: ERC-20 contract for in-game currency
- **BattleArena**: Game logic and tournament management

### State Management
```javascript
GameState {
  user: {
    address: string
    fighters: Fighter[]
    tokenBalance: number
    stats: UserStats
  }
  game: {
    currentMatch: Match
    tournaments: Tournament[]
    marketplace: MarketplaceListing[]
  }
  ui: {
    loading: boolean
    notifications: Notification[]
  }
}
```

### Data Models
```javascript
Fighter {
  id: string
  tokenId: number
  type: FighterType
  stats: {
    health: number
    mana: number
    attack: number
    defense: number
    speed: number
  }
  abilities: Ability[]
  level: number
  experience: number
}
```

## 🎨 Design System

### Colors
- **Background**: Dark purple gradient
- **Surface**: Elevated dark surfaces
- **Primary**: Blue accent color
- **Accent**: Orange highlight color
- **Success**: Green for positive actions
- **Danger**: Red for warnings/errors

### Components
- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Primary and secondary variants
- **Fighter Cards**: Specialized display for fighters
- **Stat Bars**: Animated progress indicators

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── context/            # React context providers
├── contracts/          # Smart contract interfaces
├── data/              # Game data and constants
├── config/            # Configuration files
└── styles/            # CSS and styling
```

### Key Components
- **App.jsx**: Main application with routing
- **GameContext.jsx**: Global state management
- **BattleArena.jsx**: Combat interface
- **Marketplace.jsx**: Trading interface
- **Training.jsx**: Fighter upgrade interface
- **Tournament.jsx**: Competition interface

### Smart Contract Integration
The app integrates with Base network smart contracts for:
- NFT minting and ownership
- Stat upgrades and ability unlocks
- Token transfers and rewards
- Tournament entry and prizes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Base Network
1. Deploy smart contracts to Base
2. Update contract addresses in `src/contracts/FighterNFT.js`
3. Configure environment variables
4. Deploy frontend to hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎮 Game Features Status

### ✅ Implemented
- [x] Basic battle system
- [x] Fighter cards and display
- [x] Wallet integration
- [x] Smart contract interfaces
- [x] Training system
- [x] Marketplace interface
- [x] Tournament system
- [x] Notification system
- [x] Responsive design

### 🚧 In Progress
- [ ] Smart contract deployment
- [ ] Backend API integration
- [ ] Farcaster social features
- [ ] Achievement system
- [ ] Leaderboards

### 📋 Planned
- [ ] Mobile app version
- [ ] Advanced tournament modes
- [ ] Guild system
- [ ] Seasonal events
- [ ] NFT breeding mechanics

## 🔗 Links

- [Base Network](https://base.org/)
- [RainbowKit](https://rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://framer.com/motion/)

---

Built with ❤️ for the Base ecosystem
