import { Report } from 'src/Domain/Model/Report';
export interface GetUserReportUseCase {
  GetUserReport(userId: number): Promise<Report[]>;
}
