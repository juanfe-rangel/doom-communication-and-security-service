import { Injectable } from '@nestjs/common';
import { Chat } from 'src/Domain/Model/Chat';
import { UserRole } from 'src/Domain/Model/Enum/UserRole';
import { ChatRepository } from 'src/Domain/Repository/ChatRepository';
import { RedisConfig } from 'src/Infrastructure/Config/Redis/Redis.Config';
import { Message } from 'src/Domain/Model/Message';
import { User } from 'src/Domain/Model/User';

@Injectable()
export class ChatRedisCache implements ChatRepository {
  constructor(private readonly redis: RedisConfig) {}

  async save(chat: Chat): Promise<Chat> {
    console.log(chat);
    return this.persist(chat);
  }

  async findById(id: string): Promise<Chat> {
    const raw = await this.redis.get(this.chatKey(id));

    if (!raw) {
      throw new Error(`Chat not found: ${id}`);
    }

    const data = JSON.parse(raw);
    return ChatMapper.toDomain(data);
  }

  async findByParticipantId(pId: number): Promise<Chat> {
    const chatId = await this.redis.get(this.participantKey(pId));

    if (!chatId) {
      throw new Error(`Chat not found for participant: ${pId}`);
    }

    return this.findById(chatId);
  }

  async findByTravelId(tId: string): Promise<Chat> {
    const chatId = await this.redis.get(this.travelKey(String(tId)));

    if (!chatId) {
      throw new Error(`Chat not found for travel: ${tId}`);
    }

    return this.findById(chatId);
  }

  async update(chat: Chat): Promise<Chat> {
    try {
      const existing = await this.findById(chat.chatId);
      await this.removeIndexes(existing);
    } catch {
      // no previous indexes to clean
    }

    return this.persist(chat);
  }

  async updatePassengers(id: string, passengersIds: number[]): Promise<void> {
    const chat = await this.findById(id);

    await this.removeIndexes(chat);

    chat.participants = this.buildParticipants(chat.driverId, passengersIds);

    await this.persist(chat);
  }

  async updatePassengersByTravelId(
    tid: string,
    passengersIds: number[],
  ): Promise<void> {
    const chatId = await this.redis.get(this.travelKey(tid));

    if (!chatId) {
      throw new Error(`Chat not found for travel: ${tid}`);
    }

    await this.updatePassengers(chatId, passengersIds);
  }

  async deleteById(id: string): Promise<void> {
    try {
      const chat = await this.findById(id);
      await this.removeIndexes(chat);
    } catch {}

    await this.redis.del(this.chatKey(id));
  }

  async deleteByTravelId(tId: string): Promise<void> {
    const chatId = await this.redis.get(this.travelKey(tId));

    if (!chatId) {
      return;
    }

    await this.deleteById(chatId);
  }

  async exists(id: string): Promise<boolean> {
    const raw = await this.redis.get(this.chatKey(id));
    return raw !== null;
  }

  private chatKey(chatId: string): string {
    return `chat:${chatId}`;
  }

  private travelKey(travelId: string): string {
    return `chat:travel:${travelId}`;
  }

  private participantKey(participantId: number): string {
    return `chat:participant:${participantId}`;
  }

  private buildParticipants(driverId: number | null, passengersIds: number[]) {
    const participants = passengersIds.map((userId) => ({
      userId,
      userRole: UserRole.PASSENGER,
    }));

    if (driverId !== null) {
      participants.push({
        userId: driverId,
        userRole: UserRole.DRIVER,
      });
    }

    return participants;
  }

  private async persist(chat: Chat): Promise<Chat> {
    await this.redis.set(this.chatKey(chat.chatId), JSON.stringify(chat));

    await this.redis.set(this.travelKey(chat.travelId), chat.chatId);

    for (const participant of chat.participants) {
      await this.redis.set(
        this.participantKey(participant.userId),
        chat.chatId,
      );
    }

    return chat;
  }

  private async removeIndexes(chat: Chat): Promise<void> {
    await this.redis.del(this.travelKey(chat.travelId));

    for (const participant of chat.participants) {
      const currentChatId = await this.redis.get(
        this.participantKey(participant.userId),
      );

      if (currentChatId === chat.chatId) {
        await this.redis.del(this.participantKey(participant.userId));
      }
    }
  }
}

export class ChatMapper {
  static toDomain(data: any): Chat {
    return new Chat(
      data.chatId,
      data.travelId,
      data.driverId,
      data.participants.map((p: any) => new User(p.userId, p.userRole)),
      data.active,
      new Date(data.createdAt),
      data.messages.map(
        (m: any) =>
          new Message(
            m.messageId,
            m.senderid,
            m.content,
            new Date(m.timestamp),
          ),
      ),
    );
  }
}
