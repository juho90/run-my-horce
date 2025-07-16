import { InjectRedis } from '@nestjs-modules/ioredis/dist/redis.decorators';
import { Injectable } from '@nestjs/common';
import { RaceCorner } from 'engine/src/raceCorner';
import { RaceLine } from 'engine/src/raceLine';
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

  async findTrack(raceId: number): Promise<RaceTrack | null> {
    const data = await this.redis.get(`raceTrack:${raceId}`);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as RaceTrack;
  }

  convertForRace(raceTrack: {
    width: number;
    height: number;
    segments: RaceSegment[];
  }) {
    const raceSegments = new Array<RaceSegment>(raceTrack.segments.length);
    for (let index = 0; index < raceTrack.segments.length; index++) {
      const parseSegment = raceTrack.segments[index] as RaceSegment;
      if (parseSegment.type === 'line') {
        const lineSegment = parseSegment as RaceLine;
        raceSegments[index] = new RaceLine(lineSegment.start, lineSegment.end);
      } else {
        const cornerSegment = parseSegment as RaceCorner;
        raceSegments[index] = new RaceCorner(
          cornerSegment.start,
          cornerSegment.end,
          cornerSegment.radius,
          cornerSegment.angle,
        );
      }
    }
    return new RaceTrack(raceTrack.width, raceTrack.height, raceSegments);
  }
}
