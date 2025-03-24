export interface TradingConfig {
  apiKey: string;
  apiSecret: string;
  mode: 'classic' | 'hedge';
  leverage: 1 | 3 | 5 | 10 | 20;
  symbol: string;
}

export interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  leverage: number;
  unrealizedPnl: number;
}

export interface GridLevel {
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface AccountBalance {
  total: number;
  available: number;
  used: number;
}

export interface TradingState {
  config: TradingConfig | null;
  positions: Position[];
  gridLevels: GridLevel[];
  isConnected: boolean;
  balance: AccountBalance | null;
}