import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtener datos del cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Guardar datos en cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Eliminar clave del cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Limpiar todo el cache
   * Nota: cache-manager v5+ no tiene método reset, se debe limpiar manualmente
   */
  async reset(): Promise<void> {
    try {
      // En cache-manager v5+, no hay método reset global
      // Se debe limpiar manualmente o usar store.reset() si está disponible
      this.logger.warn('⚠️ Reset de cache no disponible en esta versión de cache-manager');
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  /**
   * Invalidar cache de rifas activas
   */
  async invalidateRaffles(): Promise<void> {
    await this.del('raffles:active');
    await this.del('raffles:all');
    this.logger.log('✅ Cache de rifas invalidado');
  }

  /**
   * Invalidar cache de una rifa específica
   */
  async invalidateRaffle(slug: string): Promise<void> {
    await this.del(`raffle:slug:${slug}`);
    await this.invalidateRaffles();
    this.logger.log(`✅ Cache de rifa ${slug} invalidado`);
  }

  /**
   * Invalidar cache de ganadores
   */
  async invalidateWinners(): Promise<void> {
    await this.del('winners:all');
    this.logger.log('✅ Cache de ganadores invalidado');
  }

  /**
   * Invalidar cache de settings
   */
  async invalidateSettings(): Promise<void> {
    await this.del('settings:main');
    this.logger.log('✅ Cache de settings invalidado');
  }
}
