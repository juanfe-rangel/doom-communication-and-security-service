import { Report } from 'src/Domain/Model/Report';

export interface GetReportsUseCase {
  GetReports(): Promise<Report[]>;
}
