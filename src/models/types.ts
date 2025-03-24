export interface TradingConfig {
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
  mode: 'ISOLATED' | 'CROSS';
  leverage: 1 | 3 | 5 | 10 | 20;
  symbol: string;
}

export interface AccountBalance {
  balance: number;
  availableBalance: number;
}

export interface Position {
  symbol: string;
  side: 'Buy' | 'Sell';
  size: number;
  entryPrice: number;
  leverage: number;
  unrealizedPnl: number;
  marginType: 'isolated' | 'cross';
  positionValue: number;
  markPrice: number;
  liqPrice: number;
}

export interface Order {
  orderId: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  orderType: 'Limit' | 'Market';
  price: number;
  qty: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  orderStatus: 'Created' | 'New' | 'Rejected' | 'PartiallyFilled' | 'Filled' | 'Cancelled';
  cumExecQty: number;
  cumExecValue: number;
  avgPrice: number;
  createTime: string;
  updateTime: string;
}

export interface BybitResponse<T> {
  retCode: number;
  retMsg: string;
  result: T;
  retExtInfo: any;
  time: number;
}

export interface WalletBalanceResult {
  list: Array<{
    totalEquity: string;
    accountType: string;
    totalMarginBalance: string;
    totalInitialMargin: string;
    totalMaintenanceMargin: string;
    totalPerpUPL: string;
    totalSpotBalance: string;
    totalAvailableBalance: string;
    accountIMRate: string;
    accountMMRate: string;
    totalPerpOrderIM: string;
    totalPositionIM: string;
    coin: Array<{
      coin: string;
      equity: string;
      usdValue: string;
      walletBalance: string;
      availableToWithdraw: string;
      availableToBorrow: string;
      borrowAmount: string;
      accruedInterest: string;
      totalOrderIM: string;
      totalPositionIM: string;
      unrealisedPnl: string;
      cumRealisedPnl: string;
    }>;
  }>;
}

export interface PositionResult {
  list: Array<{
    symbol: string;
    side: string;
    size: string;
    avgPrice: string;
    positionValue: string;
    leverage: string;
    unrealisedPnl: string;
    tradeMode: number;
    autoAddMargin: number;
    positionIdx: number;
    riskId: number;
    riskLimitValue: string;
    stopLoss: string;
    takeProfit: string;
    trailingStop: string;
    liqPrice: string;
    bustPrice: string;
    category: string;
    positionStatus: string;
    adlRankIndicator: number;
    createdTime: string;
    updatedTime: string;
  }>;
}

export interface TradingState {
  config: TradingConfig;
  setConfig: (config: TradingConfig) => void;
}

// Tipos da API V5 da Bybit
export type OrderTimeInForce = 'GTC' | 'IOC' | 'FOK' | 'PostOnly';

export interface BybitOrder {
  symbol: string;
  side: 'Buy' | 'Sell';
  orderType: 'Market' | 'Limit';
  qty: string;
  price?: string;
  timeInForce: OrderTimeInForce;
  category: 'linear';
  reduceOnly?: boolean;
  closeOnTrigger?: boolean;
}

export interface BybitPositionV5 {
  symbol: string;
  side: string;
  size: string;
  avgPrice: string;
  positionValue: string;
  leverage: string;
  unrealisedPnl: string;
  cumRealisedPnl: string;
  createdTime: string;
  updatedTime: string;
  tpslMode: string;
  riskId: number;
  riskLimitValue: string;
  stopLoss: string;
  takeProfit: string;
  trailingStop: string;
  positionIdx: number;
  positionMM: string;
}

export interface Balance {
  total: number;
  available: number;
  frozen: number;
}

export interface ApiError {
  code: number;
  message: string;
}