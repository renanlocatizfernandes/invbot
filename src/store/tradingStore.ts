import create from 'zustand';
import { TradingConfig, Position, GridLevel, AccountBalance, TradingState } from '../models/types';

interface TradingStore extends TradingState {
  setConfig: (config: TradingConfig) => void;
  updatePositions: (positions: Position[]) => void;
  updateGridLevels: (levels: GridLevel[]) => void;
  setConnectionStatus: (status: boolean) => void;
  updateBalance: (balance: AccountBalance) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  config: null,
  positions: [],
  gridLevels: [],
  isConnected: false,
  balance: null,
  
  setConfig: (config) => set({ config }),
  updatePositions: (positions) => set({ positions }),
  updateGridLevels: (levels) => set({ gridLevels: levels }),
  setConnectionStatus: (status) => set({ isConnected: status }),
  updateBalance: (balance) => set({ balance }),
}));