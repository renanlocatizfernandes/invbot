import create from 'zustand';
import { TradingConfig, Position, GridLevel, AccountBalance, TradingState } from '../models/types';

// Carregar configurações salvas do localStorage
const loadSavedConfig = (): TradingConfig | null => {
  try {
    const saved = localStorage.getItem('tradingConfig');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

interface TradingState {
  config: TradingConfig | null;
  isConnected: boolean;
  lastError: string | null;
  positions: any[]; // Será tipado posteriormente
  orders: any[]; // Será tipado posteriormente
  balance: {
    total: number;
    available: number;
    frozen: number;
  } | null;
  setConfig: (config: TradingConfig) => void;
  setConnected: (status: boolean) => void;
  setError: (error: string | null) => void;
  setPositions: (positions: any[]) => void;
  setOrders: (orders: any[]) => void;
  setBalance: (balance: { total: number; available: number; frozen: number }) => void;
  reset: () => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  config: null,
  isConnected: false,
  lastError: null,
  positions: [],
  orders: [],
  balance: null,
  setConfig: (config) => set({ config, lastError: null }),
  setConnected: (status) => set({ isConnected: status }),
  setError: (error) => set({ lastError: error }),
  setPositions: (positions) => set({ positions }),
  setOrders: (orders) => set({ orders }),
  setBalance: (balance) => set({ balance }),
  reset: () => set({
    config: null,
    isConnected: false,
    lastError: null,
    positions: [],
    orders: [],
    balance: null
  })
}));