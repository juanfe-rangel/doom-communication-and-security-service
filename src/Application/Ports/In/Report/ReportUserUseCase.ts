import { Report } from 'src/Domain/Model/Report';
import { ReportUserDTO } from 'src/Infrastructure/Inbound/Report/ReportDTOS';

export interface ReportUserUseCase {
  ReportUser(reportDTO: ReportUserDTO): Promise<Report>;
}
