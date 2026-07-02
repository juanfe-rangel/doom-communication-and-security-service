import { ReportStatus } from './Enum/ReportStatus';

export class Report {
  constructor(
    public reportId: string,
    public reportDescription: string,
    public reportStatus: ReportStatus,
    public reportCreatedAt: Date,
    public reportUpdatedAt: Date,
    public reportUserId: number,
    public reportedParticipantId: number,
    public reportTravelId: string,
  ) {}

  changeStatus(status: ReportStatus) {
    this.reportStatus = status;
    this.reportUpdatedAt = new Date();
  }
}
