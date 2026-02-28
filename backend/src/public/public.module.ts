import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TrackingModule } from '../tracking/tracking.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, TrackingModule, CacheModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
