import { Test, TestingModule } from '@nestjs/testing';
import { MarketAnalysisController } from './market-analysis.controller';

describe('MarketAnalysisController', () => {
  let controller: MarketAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketAnalysisController],
    }).compile();

    controller = module.get<MarketAnalysisController>(MarketAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
