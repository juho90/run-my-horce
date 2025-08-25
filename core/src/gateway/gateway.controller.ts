import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BettingService } from 'src/betting/betting.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { HorseService } from 'src/race/horse.service';
import { RaceService } from 'src/race/race.service';
import { TrackService } from 'src/race/track.service';

@ApiTags('gateway')
@Controller('api')
export class GatewayController {
  constructor(
    private readonly inventoryService: InventoryService,
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

  @Get('race/latest')
  @ApiOperation({ summary: 'Get latest race information' })
  @ApiResponse({ status: 200, description: 'Latest race data or empty object' })
  getLatestRace() {
    return this.raceService.findLatestRace() || {};
  }

  @Get('horses')
  @ApiOperation({ summary: 'Get all horses' })
  @ApiResponse({ status: 200, description: 'List of all horses' })
  findAllHorses() {
    return this.horseService.findHorseAll();
  }

  @Get('horses/:raceId')
  @ApiOperation({ summary: 'Get horses by race ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of horses for the race' })
  @ApiResponse({ status: 404, description: 'Race not found' })
  findAllHorsesByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.horseService.findHorseAllByRaceId(raceId);
  }

  @Get('horses/latest')
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
    const horses = await this.horseService.findHorseAllByRaceId(race.raceId);
    return horses || {};
  }

  @Get('track/:raceId')
  @ApiOperation({ summary: 'Get track configuration by race ID' })
  @ApiParam({ name: 'raceId', description: 'Race ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Track configuration' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  findTrackByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.trackService.findTrack(raceId);
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
