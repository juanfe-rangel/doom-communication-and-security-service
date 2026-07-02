import { Report } from 'src/Domain/Model/Report';
export interface GetReportByIdUseCase {
  GetReportById(id: string): Promise<Report | null>;
}
