// Smart contract integration for Fighter NFTs
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// Fighter NFT Contract ABI (simplified for demo)
export const FIGHTER_NFT_ABI = [
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "fighterType", "type": "uint8"},
      {"name": "baseStats", "type": "uint256[6]"}
    ],
    "name": "mintFighter",
    "outputs": [{"name": "tokenId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getFighterData",
    "outputs": [
      {"name": "fighterType", "type": "uint8"},
      {"name": "level", "type": "uint8"},
      {"name": "experience", "type": "uint256"},
      {"name": "baseStats", "type": "uint256[6]"},
      {"name": "abilities", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "getFightersByOwner",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "statIndex", "type": "uint8"},
      {"name": "amount", "type": "uint8"}
    ],
    "name": "upgradeStat",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "abilityId", "type": "uint256"}
    ],
    "name": "unlockAbility",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Game Token Contract ABI
export const GAME_TOKEN_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract addresses (these would be deployed contracts on Base)
export const CONTRACT_ADDRESSES = {
  FIGHTER_NFT: '0x1234567890123456789012345678901234567890', // Placeholder
  GAME_TOKEN: '0x0987654321098765432109876543210987654321', // Placeholder
  BATTLE_ARENA: '0x1111222233334444555566667777888899990000' // Placeholder
};

export class ContractService {
  constructor(walletClient) {
    this.walletClient = walletClient;
    this.publicClient = createPublicClient({
      chain: base,
      transport: http()
    });
  }

  // Mint a new fighter NFT
  async mintFighter(fighterType, baseStats) {
    try {
      const mintPrice = parseEther('0.001'); // 0.001 ETH mint price
      
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.FIGHTER_NFT,
        abi: FIGHTER_NFT_ABI,
        functionName: 'mintFighter',
        args: [this.walletClient.account.address, fighterType, baseStats],
        value: mintPrice
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error minting fighter:', error);
      throw error;
    }
  }

  // Get fighter data from contract
  async getFighterData(tokenId) {
    try {
      const data = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.FIGHTER_NFT,
        abi: FIGHTER_NFT_ABI,
        functionName: 'getFighterData',
        args: [tokenId]
      });

      return {
        fighterType: data[0],
        level: data[1],
        experience: data[2],
        baseStats: data[3],
        abilities: data[4]
      };
    } catch (error) {
      console.error('Error getting fighter data:', error);
      throw error;
    }
  }

  // Get all fighters owned by an address
  async getFightersByOwner(ownerAddress) {
    try {
      const tokenIds = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.FIGHTER_NFT,
        abi: FIGHTER_NFT_ABI,
        functionName: 'getFightersByOwner',
        args: [ownerAddress]
      });

      // Get detailed data for each fighter
      const fighters = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const data = await this.getFighterData(tokenId);
          return { tokenId, ...data };
        })
      );

      return fighters;
    } catch (error) {
      console.error('Error getting fighters by owner:', error);
      throw error;
    }
  }

  // Upgrade fighter stats
  async upgradeStat(tokenId, statIndex, amount) {
    try {
      const upgradePrice = parseEther('0.0001'); // 0.0001 ETH per stat point
      
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.FIGHTER_NFT,
        abi: FIGHTER_NFT_ABI,
        functionName: 'upgradeStat',
        args: [tokenId, statIndex, amount],
        value: upgradePrice * BigInt(amount)
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error upgrading stat:', error);
      throw error;
    }
  }

  // Unlock new ability for fighter
  async unlockAbility(tokenId, abilityId) {
    try {
      const unlockPrice = parseEther('0.0005'); // 0.0005 ETH per ability
      
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.FIGHTER_NFT,
        abi: FIGHTER_NFT_ABI,
        functionName: 'unlockAbility',
        args: [tokenId, abilityId],
        value: unlockPrice
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error unlocking ability:', error);
      throw error;
    }
  }

  // Get game token balance
  async getTokenBalance(address) {
    try {
      const balance = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.GAME_TOKEN,
        abi: GAME_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [address]
      });

      return formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  // Transfer game tokens
  async transferTokens(to, amount) {
    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.GAME_TOKEN,
        abi: GAME_TOKEN_ABI,
        functionName: 'transfer',
        args: [to, parseEther(amount.toString())]
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }
}

export default ContractService;
