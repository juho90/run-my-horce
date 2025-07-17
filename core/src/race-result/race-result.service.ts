import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertHorsesForRace } from 'engine/src/horse';
import { RaceLog } from 'engine/src/raceLog';
import { runRaceSimulator } from 'engine/src/raceSimulator';
import { convertTrackForRace, RaceTrack } from 'engine/src/raceTrack';
import { generateRaceWebGLHtml } from 'engine/src/raceViewerWebGL';
import * as fs from 'fs';
import { Redis } from 'ioredis';
import { join } from 'path';
import { HorseService } from 'src/race/horse.service';
import { TrackService } from 'src/race/track.service';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import * as zlib from 'zlib';
import { RaceResultEntity } from './entities/race-result.entity';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

@Injectable()
export class RaceResultService {
  constructor(
    @InjectRepository(RaceResultEntity)
    private readonly raceResultRepository: Repository<RaceResultEntity>,
    @InjectRedis()
    private readonly redis: Redis,
    private readonly horseService: HorseService,
    private readonly trackService: TrackService,
  ) {}

  async findResultByRaceId(raceId: number) {
    return await this.raceResultRepository.findOne({
      where: { raceId },
    });
  }

  async findLogByRaceId(raceId: number): Promise<string> {
    const logs = await this.redis.exists(`raceLogs:${raceId}`);
    if (!logs) {
      throw new Error(`Not found race logs for race ${raceId}`);
    }
    return `http://localhost:28000/race/race-${raceId}.html`;
  }

  async createRaceResult(raceResult: Partial<RaceResultEntity>) {
    const result = this.raceResultRepository.create(raceResult);
    return await this.raceResultRepository.save(result);
  }

  async createRaceLog(raceId: number) {
    const horses = await this.horseService.findHorseAllByRaceId(raceId);
    if (horses.length === 0) {
      throw new Error(`Not found horses for race ${raceId}`);
    }
    const track = await this.trackService.findTrack(raceId);
    if (!track) {
      throw new Error(`Not found track for race ${raceId}`);
    }
    const convertedHorses = convertHorsesForRace(horses);
    const convertedTrack = convertTrackForRace(track);
    const raceLogs = runRaceSimulator(convertedTrack, convertedHorses);
    await this.saveRaceLogs(raceId, raceLogs);
    await this.generateRaceHTML(raceId, convertedTrack, raceLogs);
  }

  async saveRaceLogs(raceId: number, raceLogs: RaceLog[]) {
    try {
      const jsonString = JSON.stringify(raceLogs);
      const compressed = await gzip(jsonString);
      await this.redis.set(`raceLogs:${raceId}`, compressed);
    } catch (error) {
      throw new Error(`Failed to save race logs for race ${raceId}`);
    }
  }

  async loadRaceLogs(raceId: number) {
    try {
      const compressed = await this.redis.getBuffer(`raceLogs:${raceId}`);
      if (!compressed) {
        return null;
      }
      const decompressed = await gunzip(compressed);
      const jsonString = decompressed.toString();
      return JSON.parse(jsonString) as RaceLog[];
    } catch (error) {
      throw new Error(`Failed to load race logs for race ${raceId}`);
    }
  }

  private async generateRaceHTML(
    raceId: number,
    track: RaceTrack,
    raceLogs: RaceLog[],
  ) {
    const htmlString = generateRaceWebGLHtml(track, raceLogs);
    const staticDir = join(process.cwd(), process.env.HTML_FILE_PATH!);
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    const filePath = join(staticDir, `race-${raceId}.html`);
    fs.writeFileSync(filePath, htmlString, 'utf8');
    Logger.log(`Race HTML generated: ${filePath}`);
  }
}
