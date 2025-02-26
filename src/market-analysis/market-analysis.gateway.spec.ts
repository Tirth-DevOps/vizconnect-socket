import { Test, TestingModule } from '@nestjs/testing';
import { MarketAnalysisGateway } from './market-analysis.gateway';

describe('MarketAnalysisGateway', () => {
  let gateway: MarketAnalysisGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketAnalysisGateway],
    }).compile();

    gateway = module.get<MarketAnalysisGateway>(MarketAnalysisGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
