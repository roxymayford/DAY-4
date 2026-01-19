import { Controller, Get, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { EventSearchDto } from './dto/event-search.dto'; // Import DTO yang baru dibuat
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Blockchain') // Biar rapi di Swagger
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // Endpoint cek value terakhir
  @Get('value')
  @ApiOperation({ summary: 'Ambil value terakhir dari Smart Contract' })
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  // Endpoint cari event (POST)
  @Post('events')
  @ApiOperation({ summary: 'Cari history perubahan value (Max 2048 blocks)' })
  @ApiResponse({ status: 200, description: 'Data event ditemukan.' })
  @ApiResponse({ status: 500, description: 'Range block terlalu jauh!' })
  async getEvents(@Body() body: EventSearchDto) {
    return this.blockchainService.getValueUpdatedEvents(
      body.fromBlock,
      body.toBlock,
    );
  }
}