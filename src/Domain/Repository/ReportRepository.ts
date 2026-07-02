import { Chat } from '../Model/Chat';
import { Report } from '../Model/Report';

export interface ReportRepository {
  save(report: Report): Promise<Report>;
  saveChat(chat: Chat, reportId: string): Promise<Report>;
  findAll(): Promise<Report[]>;
  findById(id: string): Promise<Report | null>;
  findByUserId(userId: number): Promise<Report[]>;
  findByTravelId(travelId: string): Promise<Report[]>;
  update(report: Report): Promise<Report>;
  deleteById(id: string): Promise<void>;
  deleteByTravelId(travelId: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
