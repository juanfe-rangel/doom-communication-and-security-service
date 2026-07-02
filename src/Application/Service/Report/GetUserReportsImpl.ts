import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetUserReportUseCase } from 'src/Application/Ports/In/Report/GetUserReportUseCase';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import type { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { Report } from 'src/Domain/Model/Report';

@Injectable()
export class GetUserReportsImpl implements GetUserReportUseCase {
  constructor(
    @Inject(REPORT_PORTS.ReportRepository)
    private readonly reportRepository: ReportRepository,
  ) {}

  async GetUserReport(userId: number): Promise<Report[]> {
    try {
      return await this.reportRepository.findByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving user reports' + error,
      );
    }
  }
}
