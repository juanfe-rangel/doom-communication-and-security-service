import { Injectable } from '@nestjs/common';
import { Chat } from 'src/Domain/Model/Chat';
import { Report } from 'src/Domain/Model/Report';
import { ReportRepository } from 'src/Domain/Repository/ReportRepository';
import { PrismaService } from 'src/Infrastructure/Config/PrismaService';
import { ReportStatus } from 'src/Domain/Model/Enum/ReportStatus';

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(report: Report): Promise<Report> {
    const created = await this.prisma.report.create({
      data: {
        reportId: report.reportId,
        reportDescription: report.reportDescription,
        reportStatus: report.reportStatus,
        reportUserId: report.reportUserId,
        reportedParticipantId: report.reportedParticipantId,
        reportTravelId: report.reportTravelId,
        reportCreatedAt: report.reportCreatedAt,
        reportUpdatedAt: report.reportUpdatedAt,
      },
    });

    return this.toDomain(created);
  }

  async saveChat(chat: Chat, reportId: string): Promise<Report> {
    const updated = await this.prisma.report.update({
      where: { reportId },
      data: {
        chat: {
          create: {
            chatId: chat.chatId,
            travelId: chat.travelId,
            driverId: chat.driverId,
            active: chat.active,
            createdAt: chat.createdAt,
            participants: {
              create: chat.participants.map((p) => ({
                userId: p.userId,
                userRole: p.userRole,
              })),
            },
            messages: {
              create: chat.messages.map((m) => ({
                messageId: m.messageId,
                senderId: m.senderid,
                content: m.content,
                timestamp: m.timestamp,
              })),
            },
          },
        },
      },
      include: {
        chat: {
          include: {
            participants: true,
            messages: true,
          },
        },
      },
    });

    return this.toDomainWithChat(updated);
  }

  async findAll(): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      orderBy: { reportCreatedAt: 'desc' },
    });

    return reports.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.prisma.report.findUnique({
      where: { reportId: id },
      include: {
        chat: {
          include: {
            participants: true,
            messages: { orderBy: { timestamp: 'asc' } },
          },
        },
      },
    });

    return report ? this.toDomainWithChat(report) : null;
  }

  async findByUserId(userId: number): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      where: { reportUserId: userId },
      orderBy: { reportCreatedAt: 'desc' },
    });

    return reports.map((r) => this.toDomain(r));
  }

  async findByTravelId(travelId: string): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      where: { reportTravelId: travelId },
      orderBy: { reportCreatedAt: 'desc' },
    });

    return reports.map((r) => this.toDomain(r));
  }

  async update(report: Report): Promise<Report> {
    const updated = await this.prisma.report.update({
      where: { reportId: report.reportId },
      data: {
        reportDescription: report.reportDescription,
        reportStatus: report.reportStatus,
        reportUpdatedAt: report.reportUpdatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.report.delete({
      where: { reportId: id },
    });
  }

  async deleteByTravelId(travelId: string): Promise<void> {
    await this.prisma.report.deleteMany({
      where: { reportTravelId: travelId },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.report.count({
      where: { reportId: id },
    });

    return count > 0;
  }

  // Métodos auxiliares para mapeo
  private toDomain(prismaReport: any): Report {
    return new Report(
      prismaReport.reportId,
      prismaReport.reportDescription,
      prismaReport.reportStatus as ReportStatus,
      prismaReport.reportCreatedAt,
      prismaReport.reportUpdatedAt,
      prismaReport.reportUserId,
      prismaReport.reportedParticipantId,
      prismaReport.reportTravelId,
    );
  }

  private toDomainWithChat(prismaReport: any): Report {
    const report = this.toDomain(prismaReport);

    // Si existe chat, podríamos agregarlo al reporte si fuera necesario
    // Por ahora, el modelo Report no tiene una propiedad chat

    return report;
  }
}
