import type { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { Report } from 'src/Domain/Model/Report';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { GetReportsUseCase } from 'src/Application/Ports/In/Report/GetReportsUseCase';

@Injectable()
export class GetReportUseCaseImpl implements GetReportsUseCase {
  constructor(
    @Inject(REPORT_PORTS.ReportRepository)
    private readonly reportRepository: ReportRepository,
  ) {}

  async GetReports(): Promise<Report[]> {
    try {
      return await this.reportRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving reports' + error,
      );
    }
  }
}
