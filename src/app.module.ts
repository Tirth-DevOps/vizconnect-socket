import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketAnalysisController } from './market-analysis/market-analysis.controller';
import { MarketAnalysisGateway } from './market-analysis/market-analysis.gateway';
import { MarketAnalysisService } from './market-analysis/market-analysis.service';
// import { OrderModule } from './order/order.module';
// import { DatabaseModule } from './database/database.module';
// import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [],
  controllers: [AppController, MarketAnalysisController],
  providers: [AppService, MarketAnalysisGateway, MarketAnalysisService],
})
export class AppModule {}
