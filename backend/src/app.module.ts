
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MetaModule } from './meta/meta.module';
import { TrackingModule } from './tracking/tracking.module';
import { UploadModule } from './upload/upload.module';
import { InitController } from './init.controller';
import { InitDatabaseService } from './init-database';
import { CustomThrottlerGuard } from './auth/guards/custom-throttler.guard';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    // ConfigModule para variables de entorno (necesario para Redis)
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate Limiting Configuration
    // Configuración global: 100 peticiones por minuto por defecto
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto en milisegundos
      limit: 100, // 100 peticiones por minuto
    }]),
    CacheModule, // Módulo de caché (debe ir antes de otros módulos que lo usan)
    PrismaModule, 
    PublicModule, 
    AdminModule, 
    AnalyticsModule, 
    MetaModule, 
    TrackingModule,
    UploadModule
  ],
  controllers: [AppController, InitController],
  providers: [
    AppService, 
    InitDatabaseService,
    // Aplicar CustomThrottlerGuard globalmente para límites personalizados
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
