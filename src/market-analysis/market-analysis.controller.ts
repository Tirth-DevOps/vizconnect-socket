import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MarketAnalysisService } from './market-analysis.service';
import { ResponseError, ResponseSuccess } from 'src/common/dto';

@Controller('market-analysis')
export class MarketAnalysisController {
  constructor(private readonly marketAnalysisService: MarketAnalysisService) {}
  @Get('/general-info')
  async getInfo() {
    const result = await this.marketAnalysisService.getInfo();
    if (!result.success) {
      return new ResponseError(result.data, result.message).getResponse();
    }
    return new ResponseSuccess(result.data, result.message).getResponse();
  }

  @Get('/newcoins')
  async getNewCoins() {
    try {
      return await this.marketAnalysisService.getTopList();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch new coins data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
