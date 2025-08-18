import { InjectRedis } from '@nestjs-modules/ioredis/dist/redis.decorators';
import { Injectable } from '@nestjs/common';
import { RaceSegment } from 'engine/src/raceSegment';
import { createTrack, RaceTrack } from 'engine/src/raceTrack';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class TrackService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async createTrack(raceId: number): Promise<RaceTrack> {
    const segmentCount = Math.floor(Math.random() * 12) + 6;
    const track = createTrack(segmentCount);
    await this.redis.set(`raceTrack:${raceId}`, JSON.stringify(track));
    return track;
  }

  async findTrack(raceId: number): Promise<{ segments: RaceSegment[] } | null> {
    const data = await this.redis.get(`raceTrack:${raceId}`);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as { segments: RaceSegment[] };
  }
}
