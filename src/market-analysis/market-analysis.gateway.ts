import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MarketData, NewCoins, TopGainers, TopList } from 'src/common/interfaces';

// Define interfaces or types


@WebSocketGateway({
  cors: {
    origin: '*', // Change to your frontend URL in production
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class MarketAnalysisGateway {
  @WebSocketServer() server: Server;

  // Specify proper types
  sendMarketDataToClients(marketData: MarketData) {
   // console.log('Sending market data to clients', marketData);
      this.server.emit('market-data', marketData);
  }
  

  sendTopListToClients(topList: TopList[]) {
    console.log('Sending top list to client', topList);
   
    this.server.emit('top-list', topList);
  }

  sendTopGainersToClients(topGainers: TopGainers[]) {
    console.log('Sending top gainers to clients', topGainers)
    this.server.emit('top-gainers', topGainers);
  }

  sendNewCoinsToClients(newCoins: NewCoins[]) {
    this.server.emit('new-coins', newCoins);
  }
}
