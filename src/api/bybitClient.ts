import axios, { AxiosInstance } from 'axios';
import CryptoJS from 'crypto-js';

interface BybitClientConfig {
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
}

export class BybitClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly client: AxiosInstance;
  private readonly recvWindow: number = 5000;
  private readonly testnet: boolean;
  private timeOffset: number = 0;

  constructor(config: BybitClientConfig) {
    this.apiKey = config.apiKey.trim();
    this.apiSecret = config.apiSecret.trim();
    this.testnet = config.testnet;
    this.baseUrl = config.testnet
      ? 'https://api-testnet.bybit.com'
      : 'https://api.bybit.com';

    console.log('Inicializando BybitClient:', {
      testnet: this.testnet,
      baseUrl: this.baseUrl,
      apiKeyLength: this.apiKey.length,
      apiSecretLength: this.apiSecret.length
    });

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API Key e Secret são obrigatórios');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public isTestnet(): boolean {
    return this.testnet;
  }

  private async syncTime() {
    try {
      const response = await this.client.get('/v5/market/time');
      const serverTime = response.data.result.timeSecond * 1000;
      this.timeOffset = serverTime - Date.now();
      console.log('Sincronização de tempo:', {
        serverTime,
        localTime: Date.now(),
        offset: this.timeOffset
      });
    } catch (error) {
      console.error('Erro ao sincronizar tempo:', error);
      throw new Error('Falha ao sincronizar tempo com o servidor Bybit');
    }
  }

  private getTimestamp(): number {
    return Date.now() + this.timeOffset;
  }

  private generateSignature(timestamp: number, method: string, path: string, data: any = {}): string {
    let queryString = '';
    if (method === 'GET' && Object.keys(data).length > 0) {
      const orderedParams = Object.keys(data)
        .sort()
        .reduce((obj: Record<string, any>, key: string) => {
          if (data[key] !== undefined && data[key] !== null) {
            obj[key] = data[key];
          }
          return obj;
        }, {});

      queryString = new URLSearchParams(orderedParams as Record<string, string>).toString();
    }

    const signatureParams = [
      timestamp.toString(),
      this.apiKey,
      this.recvWindow.toString(),
      path,
      method === 'GET' ? (queryString ? `?${queryString}` : '') : 
      (Object.keys(data).length > 0 ? JSON.stringify(data) : '')
    ];

    const signString = signatureParams.join('');

    console.log('Detalhes da assinatura:', {
      timestamp,
      apiKey: `${this.apiKey.substring(0, 5)}...`,
      recvWindow: this.recvWindow,
      path,
      queryString,
      method,
      signString
    });

    const signature = CryptoJS.HmacSHA256(signString, this.apiSecret).toString();
    
    return signature;
  }

  private async request(method: string, path: string, data: any = {}) {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API Key e Secret são obrigatórios');
    }

    if (this.timeOffset === 0) {
      await this.syncTime();
    }

    const timestamp = this.getTimestamp();
    const signature = this.generateSignature(timestamp, method, path, data);

    const headers = {
      'X-BAPI-API-KEY': this.apiKey,
      'X-BAPI-TIMESTAMP': timestamp.toString(),
      'X-BAPI-RECV-WINDOW': this.recvWindow.toString(),
      'X-BAPI-SIGN': signature,
      'X-BAPI-SIGN-TYPE': '2',
      'Content-Type': 'application/json'
    };

    try {
      const requestConfig = {
        method,
        url: path,
        headers,
        ...(method === 'GET' ? { params: data } : { data })
      };

      console.log('Enviando requisição:', {
        method,
        path,
        timestamp,
        recvWindow: this.recvWindow,
        isTestnet: this.testnet,
        params: method === 'GET' ? data : undefined,
        body: method === 'POST' ? data : undefined
      });

      const response = await this.client.request(requestConfig);

      console.log('Resposta da Bybit:', {
        retCode: response.data.retCode,
        retMsg: response.data.retMsg,
        result: response.data.result
      });

      if (response.data.retCode !== 0) {
        throw new Error(`${response.data.retMsg} (Código: ${response.data.retCode})`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro na requisição:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp,
        path,
        method,
        params: method === 'GET' ? data : undefined
      });

      if (error.response?.data?.retCode === 10003) {
        throw new Error('API Key inválida ou expirada');
      }

      if (error.response?.data?.retCode === 10004) {
        throw new Error('Assinatura inválida. Verifique o API Secret');
      }

      if (error.response?.data?.retCode === 10005) {
        throw new Error('Permissão negada. Verifique as permissões da API Key');
      }

      throw error;
    }
  }

  async getWalletBalance(params: { accountType: string }) {
    try {
      const response = await this.request('GET', '/v5/account/wallet-balance', params);
      
      if (!response.result || !response.result.list || response.result.list.length === 0) {
        throw new Error('Não foi possível obter dados da conta. Verifique se você tem uma conta Unified e saldo disponível.');
      }

      return response;
    } catch (error: any) {
      throw new Error(`Não foi possível obter dados da conta. Verifique:\n1. Se você está usando as credenciais corretas para o ambiente selecionado\n2. Se a API Key tem permissão de leitura\n3. Se você tem uma conta Unified\n4. Se você tem algum saldo na conta`);
    }
  }

  async getPositionInfo(params: { category: string; symbol: string }) {
    return this.request('GET', '/v5/position/list', params);
  }

  async submitOrder(params: any) {
    return this.request('POST', '/v5/order/create', params);
  }

  async setLeverage(params: any) {
    return this.request('POST', '/v5/position/set-leverage', params);
  }

  async switchPositionMode(params: any) {
    return this.request('POST', '/v5/position/switch-mode', params);
  }
} 