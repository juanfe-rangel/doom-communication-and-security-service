import { Inject, Injectable } from '@nestjs/common';
import { ReportUserUseCase } from 'src/Application/Ports/In/Report/ReportUserUseCase';
import type { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { Report } from 'src/Domain/Model/Report';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import { ReportUserDTO } from 'src/Infrastructure/Inbound/Report/ReportDTOS';
import { ReportStatus } from 'src/Domain/Model/Enum/ReportStatus';
import { randomUUID } from 'crypto';
import type { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { CHAT_PORTS } from 'src/Application/Ports/Out/ChatTokens';
import { Chat } from 'src/Domain/Model/Chat';

@Injectable()
export class ReportUserImpl implements ReportUserUseCase {
  constructor(
    @Inject(REPORT_PORTS.ReportRepository)
    private readonly reportRepository: ReportRepository,

    @Inject(CHAT_PORTS.ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  async ReportUser(reportDTO: ReportUserDTO): Promise<Report> {
    const now = new Date();
    const report = new Report(
      randomUUID(),
      reportDTO.reportDescription,
      ReportStatus.PENDING,
      now,
      now,
      reportDTO.reportUserId,
      reportDTO.reportParticipantId,
      reportDTO.reportTravelId,
    );

    const chat: Chat = await this.chatRepository.findByTravelId(
      reportDTO.reportTravelId,
    );
    console.log('Chat del report:', chat);
    this.reportRepository.saveChat(chat, report.reportId);
    return await this.reportRepository.save(report);
  }
}
