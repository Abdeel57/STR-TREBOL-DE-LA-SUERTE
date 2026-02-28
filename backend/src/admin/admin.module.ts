import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseSetupService } from './database-setup.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, AuthModule, CacheModule],
  controllers: [AdminController],
  providers: [AdminService, DatabaseSetupService],
})
export class AdminModule {}
