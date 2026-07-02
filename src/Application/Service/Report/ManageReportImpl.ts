import { ManageReportUseCase } from 'src/Application/Ports/In/Report/ManageReportUseCase';
import { Inject, Injectable } from '@nestjs/common';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import type { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { Report } from 'src/Domain/Model/Report';
import { ReportStatus } from 'src/Domain/Model/Enum/ReportStatus';

@Injectable()
export class ManageReportImpl implements ManageReportUseCase {
  constructor(
    @Inject(REPORT_PORTS.ReportRepository)
    private readonly reportRepository: ReportRepository,
  ) {}

  async ManageReport(id: string, reportS: ReportStatus): Promise<Report> {
    const report = await this.reportRepository.findById(id);

    if (!report) {
      throw new Error('Report not found');
    }

    report.changeStatus(reportS);

    return await this.reportRepository.update(report);
  }
}
