import { Test, TestingModule } from '@nestjs/testing';
import { MarketAnalysisService } from './market-analysis.service';

describe('MarketAnalysisService', () => {
  let service: MarketAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketAnalysisService],
    }).compile();

    service = module.get<MarketAnalysisService>(MarketAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
