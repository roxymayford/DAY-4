import { ApiProperty } from '@nestjs/swagger';

export class EventSearchDto {
  @ApiProperty({
    example: 50520130,
    description: 'Nomor block awal (Start Block)',
  })
  fromBlock: number;

  @ApiProperty({
    example: 50521000,
    description: 'Nomor block akhir (End Block) - Ingat selisih max 2048!',
  })
  toBlock: number;
}