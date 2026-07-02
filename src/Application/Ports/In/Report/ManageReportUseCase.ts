import { ReportStatus } from 'src/Domain/Model/Enum/ReportStatus';
import { Report } from 'src/Domain/Model/Report';

export interface ManageReportUseCase {
  ManageReport(id: string, reportStatus: ReportStatus): Promise<Report>;
}
