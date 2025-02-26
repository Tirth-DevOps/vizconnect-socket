export interface IResponse {
  success: boolean;
  message: string;
  data: any[];
}

export interface MarketData {
  symbol: string;
  price: number;
  '24hVolume': number;
}

export interface TopList {
  rank: number;
  symbol: string;
  marketCap: number;
}

export interface TopGainers {
  symbol: string;
  gainPercentage: number;
}

export interface NewCoins {
  name: string;
  symbol: string;
  marketCap: number;
}