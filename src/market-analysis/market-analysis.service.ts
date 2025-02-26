import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as WebSocket from 'ws';
import { MarketAnalysisGateway } from './market-analysis.gateway';

@Injectable()
export class MarketAnalysisService {
  private readonly COINS = [
    'btcusdt',
    'ethusdt',
    'eosusdt',
    'usdtusdt',
    'dogeusdt',
    'xrpusdt',
    'ltcusdt', // Litecoin
    'bchusdt', // Bitcoin Cash
    'linkusdt', // Chainlink
    'adausdt', // Cardano
  ];
  private ws: WebSocket;
  private readonly BINANCE_API_URL = process.env.BINANCE_API_URL;
  //private readonly COINGECKO_API_URL = process.env.COINGECKO_API_URL;

  constructor(private readonly marketAnalysisGateway: MarketAnalysisGateway) {
    this.connectWebSocket();
    this.scheduleDataFetching(); // To fetch top list, gainers, new coins
  }

  private connectWebSocket() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

    this.ws.on('open', () => {
      console.log('WebSocket connection opened');
      this.ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: this.COINS.map((coin) => `${coin}@ticker`),
          id: 1,
        }),
      );
    });

    this.ws.on('message', (data: string) => {
      const message = JSON.parse(data);
      if (message.e === '24hrTicker') {
        const marketData = this.formatMarketData(message);
        this.marketAnalysisGateway.sendMarketDataToClients(marketData);
      }
    });

    this.ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private formatMarketData(message: any) {
    return {
      symbol: message.s,
      price: message.c,
      '24hChange': message.P,
      '7day': 'N/A', // Placeholder for 7-day data if available
      '24hVolume': message.v,
    };
  }

  private async fetchAndEmitData() {
    try {
      const [topList, topGainers] = await Promise.all([
        this.getTopList(),
        this.getTopGainers(),
        // this.getNewCoins(),
      ]);

      // Emit data via gateway
      this.marketAnalysisGateway.sendTopListToClients(topList.data);
      this.marketAnalysisGateway.sendTopGainersToClients(topGainers.data);
      //   this.marketAnalysisGateway.sendNewCoinsToClients(newCoins);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch data every 10 seconds
  private scheduleDataFetching() {
    setInterval(() => {
      this.fetchAndEmitData();
    }, 5000); 
  }

  async getTopList() {
    try {
      const response = await axios.get(this.BINANCE_API_URL);
      const data = response.data;

      return {
        success: true,
        message: 'Top list fetched successfully',
        data: data
          .sort(
            (a: any, b: any) =>
              parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume),
          )
          .slice(0, 5)
          .map((coin: any) => ({
            symbol: coin.symbol,
            price: coin.lastPrice,
            volume: coin.quoteVolume,
            change: coin.priceChangePercent,
          })),
      };
    } catch (error) {
      return { success: false, message: error.error };
    }
  }

  async getTopGainers() {
    try {
      const response = await axios.get(this.BINANCE_API_URL);
      const data = response.data;

      return {
        success: true,
        message: 'Top Gainer list fetched successfully',
        data: data
          .sort(
            (a: any, b: any) =>
              parseFloat(b.priceChangePercent) -
              parseFloat(a.priceChangePercent),
          )
          .slice(0, 5)
          .map((coin: any) => ({
            symbol: coin.symbol,
            price: coin.lastPrice,
            change: coin.priceChangePercent,
          })),
      };
    } catch (error) {
      return { success: false, message: error.error };
    }
  }

  //    async getNewCoins() {
  //     try {
  //       const response = await axios.get(this.COINGECKO_API_URL, {
  //         params: {
  //           vs_currency: 'usd',
  //           order: 'market_cap_asc',
  //           per_page: 5,
  //           page: 1,
  //         },
  //       });

  //       return response.data.map((coin: any) => ({
  //         id: coin.id,
  //         symbol: coin.symbol,
  //         name: coin.name,
  //         price: coin.current_price,
  //         marketCap: coin.market_cap,
  //       }));
  //     } catch (error) {
  //       if (error.response && error.response.status === 429) {
  //         console.error('Rate limit exceeded. Retrying in 30 seconds...');
  //         await this.delay(30000); // Wait for 30 seconds before retrying
  //         return this.getNewCoins(); // Retry the request
  //       }
  //       console.error('Error fetching new coins:', error.message);
  //       throw new HttpException('Failed to fetch new coins data', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }

  //   private delay(ms: number) {
  //     return new Promise(resolve => setTimeout(resolve, ms));
  //   }

  async getInfo() {
    try {
      const data = {
        totalCountry: 120,
        totalCoin: 180,
        totalVolume24h: 1000000,
        globalInvestors: 500000,
      };

      return {
        success: true,
        message: 'User profile fetched successfully',
        data: data,
      };
    } catch (error) {
      return { success: false, message: error.error };
    }
  }
}
