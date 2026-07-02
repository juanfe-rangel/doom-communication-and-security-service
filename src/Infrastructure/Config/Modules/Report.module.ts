import { Module } from '@nestjs/common';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import { GetReportByIdUseCaseImpl } from 'src/Application/Service/Report/GetReporByIdImpl';
import { GetReportUseCaseImpl } from 'src/Application/Service/Report/GetReportUseCase';
import { GetUserReportsImpl } from 'src/Application/Service/Report/GetUserReportsImpl';
import { ManageReportImpl } from 'src/Application/Service/Report/ManageReportImpl';
import { ReportUserImpl } from 'src/Application/Service/Report/ReportUserImpl';

import { ReportController } from 'src/Infrastructure/Inbound/Report/ReportController';
import { PrismaReportRepository } from 'src/Infrastructure/Outbound/Prisma/PrismaReportRepository';
import { CHAT_PORTS } from '../../../Application/Ports/Out/ChatTokens';
import { ChatModule } from './Chat.module';

@Module({
  controllers: [ReportController],
  providers: [
    {
      provide: REPORT_PORTS.ReportUserUseCase,
      useClass: ReportUserImpl,
    },
    {
      provide: REPORT_PORTS.ReportRepository,
      useClass: PrismaReportRepository,
    },
    {
      provide: REPORT_PORTS.GetReportsUseCase,
      useClass: GetReportUseCaseImpl,
    },
    {
      provide: REPORT_PORTS.GetReportByIdUseCase,
      useClass: GetReportByIdUseCaseImpl,
    },
    {
      provide: REPORT_PORTS.ManageReportUseCase,
      useClass: ManageReportImpl,
    },
    {
      provide: REPORT_PORTS.GetUserReportsUseCase,
      useClass: GetUserReportsImpl,
    },
  ],
  imports: [ChatModule],
})
export class ReportModule {}
