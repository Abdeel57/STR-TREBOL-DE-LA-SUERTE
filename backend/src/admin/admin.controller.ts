import { Controller, Get, Post, Patch, Put, Delete, Body, Param, Query, HttpException, HttpStatus, Res, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { LoginDto } from './dto/login.dto';
import { CreateRaffleDto, UpdateRaffleDto } from './dto/create-raffle.dto';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { CreateWinnerDto } from './dto/create-winner.dto';
import { EditOrderDto, MarkOrderPaidDto } from './dto/update-order.dto';
// FIX: Using `import type` for types/namespaces and value import for the enum to fix module resolution.
import { type Raffle, type Winner, type Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // Dashboard
  @Roles('admin', 'superadmin')
  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Orders - ventas puede ver órdenes
  @Roles('ventas', 'admin', 'superadmin')
  @Get('orders')
  async getAllOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('raffleId') raffleId?: string,
  ) {
    try {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50; // Máximo 100

      const result = await this.adminService.getAllOrders(pageNum, limitNum, status, raffleId);
      return result;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new HttpException('Error al obtener las órdenes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles('ventas', 'admin', 'superadmin')
  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    try {
      return await this.adminService.getOrderById(id);
    } catch (error) {
      console.error('Error getting order:', error);
      throw new HttpException('Error al obtener la orden', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles('admin', 'superadmin')
  @Patch('orders/:folio/status')
  updateOrderStatus(@Param('folio') folio: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(folio, updateStatusDto.status);
  }

  @Roles('admin', 'superadmin')
  @Patch('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() orderData: any) {
    try {
      const order = await this.adminService.updateOrder(id, orderData);
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new HttpException('Error al actualizar la orden', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ventas puede marcar como pagado (su función principal)
  // Límite de 50 marcas por minuto (trabajadores pueden marcar muchos boletos)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Roles('ventas', 'admin', 'superadmin')
  @Put('orders/:id/mark-paid')
  async markOrderPaid(
    @Param('id') id: string,
    @Body() markOrderPaidDto: MarkOrderPaidDto
  ) {
    try {
      return await this.adminService.markOrderPaid(id, markOrderPaidDto.paymentMethod, markOrderPaidDto.notes);
    } catch (error) {
      console.error('Error marking order as paid:', error);
      throw new HttpException('Error al marcar la orden como pagada', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ventas puede marcar como pendiente (para corregir errores)
  // Límite de 30 correcciones por minuto
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Roles('ventas', 'admin', 'superadmin')
  @Put('orders/:id/mark-pending')
  async markOrderAsPending(@Param('id') id: string) {
    try {
      return await this.adminService.markOrderAsPending(id);
    } catch (error) {
      console.error('Error marking order as pending:', error);
      throw new HttpException('Error al marcar la orden como pendiente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles('admin', 'superadmin')
  @Put('orders/:id/edit')
  async editOrder(
    @Param('id') id: string,
    @Body() editOrderDto: EditOrderDto
  ) {
    try {
      return await this.adminService.editOrder(id, editOrderDto);
    } catch (error) {
      console.error('Error editing order:', error);
      throw new HttpException('Error al editar la orden', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles('admin', 'superadmin')
  @Put('orders/:id/release')
  async releaseOrder(@Param('id') id: string) {
    try {
      return await this.adminService.releaseOrder(id);
    } catch (error) {
      console.error('Error releasing order:', error);
      throw new HttpException('Error al liberar la orden', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles('admin', 'superadmin')
  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    try {
      await this.adminService.deleteOrder(id);
      return { message: 'Orden eliminada exitosamente' };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new HttpException('Error al eliminar la orden', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Raffles - solo admin y superadmin
  @Roles('admin', 'superadmin')
  @Get('raffles')
  async getAllRaffles(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50; // Máximo 100
      const raffles = await this.adminService.getAllRaffles(limitNum);
      return raffles;
    } catch (error) {
      console.error('❌ Error in getAllRaffles controller:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al obtener las rifas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Get('raffles/finished')
  getFinishedRaffles() {
    return this.adminService.getFinishedRaffles();
  }

  // Límite de 20 creaciones por minuto para prevenir spam
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Roles('admin', 'superadmin')
  @Post('raffles')
  async createRaffle(@Body() createRaffleDto: CreateRaffleDto) {
    try {
      const raffle = await this.adminService.createRaffle(createRaffleDto);
      return {
        success: true,
        message: 'Rifa creada exitosamente',
        data: raffle
      };
    } catch (error) {
      console.error('❌ Error in createRaffle controller:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al crear la rifa',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Patch('raffles/:id')
  async updateRaffle(@Param('id') id: string, @Body() updateRaffleDto: UpdateRaffleDto) {
    try {
      console.log('📥 Controller received update request:', {
        id,
        packs: updateRaffleDto.packs,
        bonuses: updateRaffleDto.bonuses,
        packsType: typeof updateRaffleDto.packs,
        bonusesType: typeof updateRaffleDto.bonuses,
        packsIsArray: Array.isArray(updateRaffleDto.packs),
        bonusesIsArray: Array.isArray(updateRaffleDto.bonuses)
      });

      const raffle = await this.adminService.updateRaffle(id, updateRaffleDto);

      console.log('✅ Controller returning updated raffle:', {
        id: raffle.id,
        packs: raffle.packs,
        bonuses: raffle.bonuses
      });

      return {
        success: true,
        message: 'Rifa actualizada exitosamente',
        data: raffle
      };
    } catch (error) {
      console.error('❌ Error in updateRaffle controller:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al actualizar la rifa',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Delete('raffles/:id')
  async deleteRaffle(@Param('id') id: string) {
    try {
      const result = await this.adminService.deleteRaffle(id);
      return {
        success: true,
        message: 'Rifa eliminada exitosamente',
        data: result
      };
    } catch (error) {
      console.error('❌ Error in deleteRaffle controller:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al eliminar la rifa',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Get('raffles/:id/boletos/apartados/descargar')
  async downloadApartadosTickets(
    @Param('id') raffleId: string,
    @Query('formato') formato: 'csv' | 'excel' = 'csv',
    @Res() res: Response
  ) {
    try {
      const result = await this.adminService.downloadTickets(raffleId, 'apartados', formato);

      // Configurar headers para la descarga
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

      // Enviar el contenido
      if (formato === 'excel') {
        // Para Excel, el contenido viene en base64, convertirlo a buffer
        const buffer = Buffer.from(result.content, 'base64');
        res.send(buffer);
      } else {
        // Para CSV, enviar como string con UTF-8 BOM
        res.send(Buffer.from(result.content, 'utf-8'));
      }

    } catch (error) {
      console.error('❌ Error downloading apartados tickets:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al descargar boletos apartados',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Get('raffles/:id/boletos/pagados/descargar')
  async downloadPagadosTickets(
    @Param('id') raffleId: string,
    @Query('formato') formato: 'csv' | 'excel' = 'csv',
    @Res() res: Response
  ) {
    try {
      const result = await this.adminService.downloadTickets(raffleId, 'pagados', formato);

      // Configurar headers para la descarga
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

      // Enviar el contenido
      if (formato === 'excel') {
        // Para Excel, el contenido viene en base64, convertirlo a buffer
        const buffer = Buffer.from(result.content, 'base64');
        res.send(buffer);
      } else {
        // Para CSV, enviar como string con UTF-8 BOM
        res.send(Buffer.from(result.content, 'utf-8'));
      }

    } catch (error) {
      console.error('❌ Error downloading pagados tickets:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al descargar boletos pagados',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Winners - solo admin y superadmin
  @Roles('admin', 'superadmin')
  @Get('winners')
  getAllWinners() {
    return this.adminService.getAllWinners();
  }

  @Roles('admin', 'superadmin')
  @Post('winners/draw')
  drawWinner(@Body('raffleId') raffleId: string) {
    return this.adminService.drawWinner(raffleId);
  }

  @Roles('superadmin')
  @Get('fix-winners-table')
  async fixWinnersTable() {
    try {
      await this.adminService.fixWinnersTable();
      return { message: 'Tabla winners reparada exitosamente' };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al reparar tabla',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('superadmin') // Only superadmin can add indexes
  @Get('add-indexes')
  async addPerformanceIndexes() {
    try {
      const result = await this.adminService.addPerformanceIndexes();
      return {
        success: true,
        message: result.message,
        data: result
      };
    } catch (error) {
      console.error('Error adding indexes:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al agregar índices',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Post('winners')
  saveWinner(@Body() createWinnerDto: CreateWinnerDto) {
    return this.adminService.saveWinner(createWinnerDto);
  }

  @Roles('admin', 'superadmin')
  @Delete('winners/:id')
  deleteWinner(@Param('id') id: string) {
    return this.adminService.deleteWinner(id);
  }

  // Users
  // Protección especial contra fuerza bruta: solo 5 intentos por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.adminService.login(loginDto.username, loginDto.password);
      return {
        success: true,
        message: 'Login exitoso',
        data: user
      };
    } catch (error) {
      console.error('❌ Error in login controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al autenticar',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Get('users')
  async getUsers() {
    try {
      const users = await this.adminService.getUsers();
      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al obtener usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Límite de 10 creaciones de usuarios por minuto
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Roles('admin', 'superadmin')
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.adminService.createUser(createUserDto);
      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: user
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      // Si ya es una excepción de NestJS (BadRequestException), re-lanzarla
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Si es HttpException, re-lanzarla con el mismo status
      if (error instanceof HttpException) {
        throw error;
      }
      // Para otros errores, crear BadRequestException
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al crear usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.adminService.updateUser(id, updateUserDto);
      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: user
      };
    } catch (error) {
      console.error('❌ Error updating user:', error);
      // Si ya es una excepción de NestJS, re-lanzarla
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Si es HttpException, re-lanzarla con el mismo status
      if (error instanceof HttpException) {
        throw error;
      }
      // Determinar el status code apropiado
      const statusCode = error instanceof Error && error.message.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(
        error instanceof Error ? error.message : 'Error al actualizar usuario',
        statusCode
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.adminService.deleteUser(id);
      return {
        success: true,
        message: result.message || 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      // Si ya es una excepción de NestJS, re-lanzarla
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Si es HttpException, re-lanzarla con el mismo status
      if (error instanceof HttpException) {
        throw error;
      }
      // Determinar el status code apropiado
      const statusCode = error instanceof Error && error.message.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(
        error instanceof Error ? error.message : 'Error al eliminar usuario',
        statusCode
      );
    }
  }

  // Customers - ventas puede ver para corregir errores
  @Roles('ventas', 'admin', 'superadmin')
  @Get('customers')
  async getCustomers() {
    try {
      return await this.adminService.getCustomers();
    } catch (error) {
      console.error('❌ Error getting customers:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('ventas', 'admin', 'superadmin')
  @Get('customers/:id')
  async getCustomerById(@Param('id') id: string) {
    try {
      return await this.adminService.getCustomerById(id);
    } catch (error) {
      console.error('❌ Error getting customer by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al obtener cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Settings - solo admin y superadmin
  @Roles('admin', 'superadmin')
  @Post('settings')
  async updateSettings(@Body() data: any) {
    try {
      return await this.adminService.updateSettings(data);
    } catch (error: any) {
      console.error('❌ Controller error updating settings:', error);
      throw new HttpException(
        error.message || 'Error al actualizar configuración',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // --- Bulk Import Endpoints ---

  @Roles('admin', 'superadmin')
  @Post('raffles/:id/validate-tickets')
  async validateTickets(
    @Param('id') id: string,
    @Body() body: { ticketNumbers: number[] }
  ) {
    try {
      const takenTickets = await this.adminService.validateTickets(id, body.ticketNumbers);
      return { takenTickets };
    } catch (error) {
      console.error('Error validating tickets:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al validar boletos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles('admin', 'superadmin')
  @Post('raffles/:id/import')
  async importTickets(
    @Param('id') id: string,
    @Body() body: { tickets: { nombre: string; telefono: string; estado: string; boleto: number }[] }
  ) {
    try {
      const result = await this.adminService.importTickets(id, body.tickets);
      return {
        success: true,
        message: `Importación completada: ${result.success} exitosos, ${result.failed} fallidos`,
        data: result
      };
    } catch (error) {
      console.error('Error importing tickets:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Error al importar boletos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
