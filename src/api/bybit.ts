import { LinearClient } from 'bybit-api';
import { TradingConfig, Position, AccountBalance } from '../models/types';

export class BybitService {
  private client: LinearClient;

  constructor(config: TradingConfig) {
    this.client = new LinearClient({
      key: config.apiKey,
      secret: config.apiSecret,
      testnet: false
    });
  }

  async getAccountInfo(): Promise<AccountBalance> {
    const response = await this.client.getWalletBalance();
    const balance = response.result.USDT;
    return {
      total: Number(balance.wallet_balance),
      available: Number(balance.available_balance),
      used: Number(balance.used_margin)
    };
  }

  async createOrder(symbol: string, side: 'Buy' | 'Sell', qty: number, price?: number) {
    return await this.client.placeActiveOrder({
      side,
      symbol,
      order_type: price ? 'Limit' : 'Market',
      qty: qty.toString(),
      price: price?.toString(),
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false
    });
  }

  async getPositions(symbol: string): Promise<Position[]> {
    const response = await this.client.getPosition({ symbol });
    return response.result.map(pos => ({
      symbol: pos.symbol,
      side: pos.side.toLowerCase() as 'long' | 'short',
      size: Number(pos.size),
      entryPrice: Number(pos.entry_price),
      leverage: Number(pos.leverage),
      unrealizedPnl: Number(pos.unrealised_pnl)
    }));
  }

  async setLeverage(symbol: string, leverage: number) {
    return await this.client.setUserLeverage({
      symbol,
      leverage: leverage.toString()
    });
  }

  async setPositionMode(mode: 'classic' | 'hedge', symbol: string) {
    return await this.client.setPositionMode({
      symbol,
      mode: mode === 'hedge' ? 'BothSide' : 'MergedSingle'
    });
  }
}