import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import type { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { Report } from 'src/Domain/Model/Report';
import type { GetReportByIdUseCase } from 'src/Application/Ports/In/Report/GetReportByIdUseCase';

@Injectable()
export class GetReportByIdUseCaseImpl implements GetReportByIdUseCase {
  constructor(
    @Inject(REPORT_PORTS.ReportRepository)
    private readonly reportRepository: ReportRepository,
  ) {}

  async GetReportById(id: string): Promise<Report> {
    try {
      const report = await this.reportRepository.findById(id);
      if (!report) {
        throw new NotFoundException(`Report with id ${id} not found`);
      }
      return report;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving report');
    }
  }
}
