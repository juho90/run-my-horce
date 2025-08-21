import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaceHorse } from 'engine/src/raceHorse';
import { convertHorsesForRace } from 'engine/src/raceHorseStatus';
import { runRaceSimulator } from 'engine/src/raceSimulator';
import { convertTrackForRace, RaceTrack } from 'engine/src/raceTrack';
import { RaceTracker } from 'engine/src/raceTracker';
import { generateRaceWebGLHtml, RaceLog } from 'engine/src/raceViewer';
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

  async createRace(raceId: number): Promise<void> {
    const horses = await this.horseService.findHorseAllByRaceId(raceId);
    if (horses.length === 0) {
      throw new Error(`Not found horses for race ${raceId}`);
    }
    const track = await this.trackService.findTrack(raceId);
    if (!track) {
      throw new Error(`Not found track for race ${raceId}`);
    }
    const horseStatuss = convertHorsesForRace(horses);
    const raceTrack = convertTrackForRace(track);
    const raceTracker = new RaceTracker(raceTrack);
    const gateNodes = raceTracker.getGateNodes();
    const raceHorses: RaceHorse[] = horseStatuss.map((horse, index) => {
      return new RaceHorse(horse, gateNodes[index]);
    });
    const { finishedHorses, logs } = runRaceSimulator(
      raceTrack,
      raceTracker,
      raceHorses,
    );
    await this.createRaceResult({
      raceId,
      winnerHorseId: finishedHorses[0],
      ranking: finishedHorses,
    });
    await this.generateRaceHTML(raceId, raceTrack, raceTracker, logs);
  }

  async createRaceResult(
    raceResult: Partial<RaceResultEntity>,
  ): Promise<RaceResultEntity> {
    const result = this.raceResultRepository.create(raceResult);
    return await this.raceResultRepository.save(result);
  }

  async findRaceResult(raceId: number): Promise<RaceResultEntity | null> {
    return await this.raceResultRepository.findOne({
      where: { raceId },
    });
  }

  async findLogs(raceId: number): Promise<string | null> {
    const staticDir = join(process.cwd(), process.env.HTML_FILE_PATH!);
    const filePath = join(staticDir, `race-${raceId}.html`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return `${process.env.PUBLIC_URL}/race/race-${raceId}.html`;
  }

  private async generateRaceHTML(
    raceId: number,
    raceTrack: RaceTrack,
    raceTracker: RaceTracker,
    raceLogs: RaceLog[],
  ): Promise<void> {
    const htmlString = generateRaceWebGLHtml(raceTrack, raceTracker, raceLogs);
    const staticDir = join(process.cwd(), process.env.HTML_FILE_PATH!);
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    const filePath = join(staticDir, `race-${raceId}.html`);
    fs.writeFileSync(filePath, htmlString, 'utf8');
    Logger.log(`Race HTML generated: ${filePath}`);
  }
}
