import { Chat } from '../Model/Chat';

export interface ChatRepository {
  save(chat: Chat): Promise<Chat>;
  findById(id: string): Promise<Chat>;
  findByParticipantId(pId: number): Promise<Chat>;
  findByTravelId(tId: string): Promise<Chat>;
  update(chat: Chat): Promise<Chat>;
  updatePassengers(id: string, passengersIds: number[]): Promise<void>;
  updatePassengersByTravelId(
    Tid: string,
    passengersIds: number[],
  ): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByTravelId(tId: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
