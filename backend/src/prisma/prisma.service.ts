import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Conectado a la base de datos');
    } catch (error) {
      this.isConnected = false;
      this.logger.warn('⚠️ No se pudo conectar a la base de datos inicialmente');
      this.logger.warn('El servidor iniciará pero algunas funciones pueden no estar disponibles');
      this.logger.warn('Error:', error.message);
      
      // Intentar reconectar cada 10 segundos
      this.attemptReconnect();
    }
  }

  private async attemptReconnect() {
    const maxAttempts = 30; // 5 minutos máximo
    let attempts = 0;

    const reconnect = async () => {
      if (this.isConnected || attempts >= maxAttempts) {
        return;
      }

      attempts++;
      try {
        await this.$connect();
        this.isConnected = true;
        this.logger.log('✅ Reconectado a la base de datos exitosamente');
      } catch (error) {
        if (attempts < maxAttempts) {
          this.logger.debug(`Intento de reconexión ${attempts}/${maxAttempts} falló, reintentando en 10 segundos...`);
          setTimeout(reconnect, 10000);
        } else {
          this.logger.error('❌ No se pudo reconectar a la base de datos después de múltiples intentos');
        }
      }
    };

    setTimeout(reconnect, 10000); // Primer intento después de 10 segundos
  }

  // El método $connect ya está en PrismaClient, no necesitamos sobrescribirlo
}
