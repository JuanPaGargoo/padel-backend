import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EstudiosModule } from './estudios/estudios.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { CanchasModule } from './canchas/canchas.module';
import { CoachesModule } from './coaches/coaches.module';
import { PlanesMembresiaModule } from './planes-membresia/planes-membresia.module';
import { MembresiasUsuarioModule } from './membresias-usuario/membresias-usuario.module';
import { ClasesModule } from './clases/clases.module';
import { ReservasClaseModule } from './reservas-clase/reservas-clase.module';
import { TorneosModule } from './torneos/torneos.module';
import { ReservasTorneoModule } from './reservas-torneo/reservas-torneo.module';
import { ReservasCanchaModule } from './reservas-cancha/reservas-cancha.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    EstudiosModule,
    SucursalesModule,
    CanchasModule,
    CoachesModule,
    PlanesMembresiaModule,
    MembresiasUsuarioModule,
    ClasesModule,
    ReservasClaseModule,
    TorneosModule,
    ReservasTorneoModule,
    ReservasCanchaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
