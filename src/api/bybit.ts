import { BybitClient } from './bybitClient';
import { TradingConfig } from '../models/types';

export class BybitService {
  private client: BybitClient;

  constructor(apiKey: string, apiSecret: string, testnet: boolean) {
    console.log('Inicializando BybitService:', {
      testnet,
      apiKeyLength: apiKey.length,
      apiSecretLength: apiSecret.length
    });

    this.client = new BybitClient({
      apiKey,
      apiSecret,
      testnet
    });
  }

  async getAccountInfo(): Promise<any> {
    try {
      console.log('Obtendo informações da conta...');
      const response = await this.client.getWalletBalance({
        accountType: 'UNIFIED'
      });

      if (!response.result || !response.result.list || response.result.list.length === 0) {
        throw new Error('Conta não encontrada ou sem saldo');
      }

      const account = response.result.list[0];
      console.log('Dados da conta:', {
        totalEquity: account.totalEquity,
        accountType: account.accountType,
        totalAvailableBalance: account.totalAvailableBalance
      });

      return account;
    } catch (error: any) {
      console.error('Erro ao obter informações da conta:', error);
      throw error;
    }
  }

  async createOrder(order: any) {
    try {
      const response = await this.client.submitOrder({
        category: 'linear',
        symbol: order.symbol,
        side: order.side,
        orderType: order.type,
        qty: order.quantity.toString(),
        price: order.price?.toString(),
        timeInForce: 'GoodTillCancel',
        positionIdx: 0,
      });

      return response.result;
    } catch (error: any) {
      console.error('Erro ao criar ordem:', error);
      throw error;
    }
  }

  async getPositions() {
    try {
      const response = await this.client.getPositionInfo({
        category: 'linear',
        symbol: 'BTCUSDT',
      });

      return response.result.list.map((position: any) => ({
        symbol: position.symbol,
        side: position.side.toLowerCase(),
        size: Number(position.size),
        entryPrice: Number(position.avgPrice),
        leverage: Number(position.leverage),
        unrealizedPnl: Number(position.unrealisedPnl),
        marginType: position.tradeMode === 0 ? 'cross' : 'isolated',
        positionValue: Number(position.positionValue),
      }));
    } catch (error: any) {
      console.error('Erro ao buscar posições:', error);
      throw error;
    }
  }

  async setLeverage(leverage: number, symbol: string) {
    try {
      await this.client.setLeverage({
        category: 'linear',
        symbol: symbol,
        buyLeverage: leverage.toString(),
        sellLeverage: leverage.toString(),
      });
    } catch (error: any) {
      console.error('Erro ao definir alavancagem:', error);
      throw error;
    }
  }

  async setPositionMode(mode: 'classic' | 'hedge', symbol: string) {
    try {
      await this.client.switchPositionMode({
        category: 'linear',
        symbol: symbol,
        mode: mode === 'classic' ? 0 : 3,
      });
    } catch (error: any) {
      console.error('Erro ao definir modo de posição:', error);
      throw error;
    }
  }
}