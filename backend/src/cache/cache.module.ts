import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        
        // Por ahora, usar solo caché en memoria
        // Redis se puede agregar más tarde con una implementación más compatible
        // cache-manager-redis-store tiene problemas de compatibilidad con cache-manager v7
        return {
          ttl: 300, // TTL por defecto: 5 minutos
          max: 1000, // Máximo de items en cache
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}

