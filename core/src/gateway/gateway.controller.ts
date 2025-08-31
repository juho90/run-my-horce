import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BettingService } from 'src/betting/betting.service';
import { HorseService } from 'src/horse/horse.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { RaceService } from 'src/race/race.service';
import { TrackService } from 'src/race/track.service';

@ApiTags('gateway')
@Controller('api')
export class GatewayController {
  constructor(
    private readonly horseService: HorseService,
    private readonly trackService: TrackService,
    private readonly raceService: RaceService,
    private readonly raceResultService: RaceResultService,
    private readonly bettingService: BettingService,
  ) {}

  @Get('health-error')
  @ApiOperation({ summary: 'Test health check error' })
  @ApiResponse({
    status: 500,
    description: 'Always throws an error for testing',
  })
  getHealthError() {
    throw new Error('Health check failed');
  }

  @Post('health-error')
  @ApiOperation({ summary: 'Test health check error (POST)' })
  @ApiResponse({
    status: 500,
    description: 'Always throws an error for testing',
  })
  postHealthError() {
    throw new Error('Health check failed');
  }

  @Get('horses')
  @ApiOperation({ summary: 'Get all horses' })
  @ApiResponse({ status: 200, description: 'List of all horses' })
  findHorseAll() {
    return this.horseService.findHorseAll();
  }

  @Get('horse/latest')
  @ApiOperation({ summary: 'Get latest horse information' })
  @ApiResponse({
    status: 200,
    description: 'Latest horse data or empty object',
  })
  async getLatestHorse() {
    const race = await this.raceService.findLatestRace();
    if (!race) {
      return {};
    }
    const horses = await this.horseService.findHorses(race.raceId);
    return horses || {};
  }

  @Get('horse/:raceId')
  @ApiOperation({ summary: 'Get horses by race ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of horses for the race' })
  @ApiResponse({ status: 404, description: 'Race not found' })
  findAHorses(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.horseService.findHorses(raceId);
  }

  @Get('track/:raceId')
  @ApiOperation({ summary: 'Get track configuration by race ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Track configuration' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  findTrackByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.trackService.findTrack(raceId);
  }

  @Get('races-count')
  @ApiOperation({ summary: 'Get total number of races' })
  @ApiResponse({ status: 200, description: 'Total number of races' })
  getRacesCount() {
    return this.raceService.getRaceCount();
  }

  @Get('races')
  @ApiOperation({ summary: 'Get all races with pagination' })
  @ApiQuery({
    name: 'offset',
    required: true,
    type: Number,
    default: 0,
    description: 'Offset for pagination (default: 0)',
  })
  @ApiQuery({
    name: 'count',
    required: true,
    type: Number,
    default: 10,
    description: 'Number of items to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of races',
  })
  async findRaceAll(
    @Query('offset', ParseIntPipe) offset: number = 0,
    @Query('count', ParseIntPipe) count: number = 10,
  ) {
    const offsetNum = Math.max(0, offset);
    const countNum = Math.min(50, Math.max(1, count));
    return await this.raceService.findRaceAllWithPagination(
      offsetNum,
      countNum,
    );
  }

  @Get('race/latest')
  @ApiOperation({ summary: 'Get latest race information' })
  @ApiResponse({ status: 200, description: 'Latest race data or empty object' })
  getLatestRace() {
    return this.raceService.findLatestRace() || {};
  }

  @Get('race/:raceId')
  @ApiOperation({ summary: 'Get race information by ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Race data or empty object' })
  getRace(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.raceService.findRace(raceId) || {};
  }

  @Get('race-log/:raceId')
  @ApiOperation({ summary: 'Get race log HTML URL' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Race log HTML URL',
    schema: { properties: { html: { type: 'string' } } },
  })
  @ApiResponse({ status: 404, description: 'Race log not found' })
  async getRaceLog(@Param('raceId', ParseIntPipe) raceId: number) {
    const html = await this.raceResultService.findLogs(raceId);
    return { html };
  }

  @Get('race-result/:raceId')
  @ApiOperation({ summary: 'Get race result by race ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Race result data' })
  @ApiResponse({ status: 404, description: 'Race result not found' })
  getRaceResult(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.raceResultService.findRaceResult(raceId);
  }

  @Get('bets/:raceId')
  @ApiOperation({ summary: 'Get all bets for a race' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of bets for the race' })
  @ApiResponse({ status: 404, description: 'No bets found for the race' })
  getAllBets(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.bettingService.findBetsByRaceId(raceId);
  }
}
