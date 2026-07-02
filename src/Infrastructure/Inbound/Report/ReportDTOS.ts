import { ReportStatus } from '../../../Domain/Model/Enum/ReportStatus';

export class ReportUserDTO {
  reportDescription: string;
  reportUserId: number;
  reportParticipantId: number;
  reportTravelId: string;
}

export class UpdateReportStatusDto {
  reportStatus: ReportStatus;
}
