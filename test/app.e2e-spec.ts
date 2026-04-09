import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Pádel One API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let estudioId: number;
  let sucursalId: number;
  let usuarioId: number;
  let canchaId: number;
  let coachId: number;
  let planId: number;
  let membresiaId: number;
  let claseId: number;
  let reservaClaseId: number;
  let torneoId: number;
  let reservaTorneoId: number;
  let reservaCanchaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    // Limpiar datos de prueba
    await prisma.reservaCancha.deleteMany();
    await prisma.reservaTorneo.deleteMany();
    await prisma.reservaClase.deleteMany();
    await prisma.membresiaUsuario.deleteMany();
    await prisma.planMembresia.deleteMany();
    await prisma.clase.deleteMany();
    await prisma.torneo.deleteMany();
    await prisma.coach.deleteMany();
    await prisma.cancha.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.sucursal.deleteMany();
    await prisma.estudio.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Estudios ────────────────────────────────────────
  describe('POST /api/estudios', () => {
    it('debe crear un estudio', () => {
      return request(app.getHttpServer())
        .post('/api/estudios')
        .send({ nombre: 'Pádel One', logo_url: 'https://logo.com/logo.png' })
        .expect(201)
        .then((res) => {
          estudioId = res.body.id;
          expect(res.body.nombre).toBe('Pádel One');
        });
    });

    it('debe rechazar sin campos requeridos', () => {
      return request(app.getHttpServer())
        .post('/api/estudios')
        .send({})
        .expect(400);
    });
  });

  // ─── Sucursales ──────────────────────────────────────
  describe('POST /api/sucursales', () => {
    it('debe crear una sucursal', () => {
      return request(app.getHttpServer())
        .post('/api/sucursales')
        .send({
          nombre: 'Sucursal Central',
          direccion: 'Av. Principal 123',
          ciudad: 'Monterrey',
          estado: 'Nuevo León',
          codigo_postal: '64000',
          estudio_id: estudioId,
        })
        .expect(201)
        .then((res) => {
          sucursalId = res.body.id;
          expect(res.body.nombre).toBe('Sucursal Central');
        });
    });

    it('debe rechazar sin campos requeridos', () => {
      return request(app.getHttpServer())
        .post('/api/sucursales')
        .send({ nombre: 'Incompleta' })
        .expect(400);
    });
  });

  // ─── Usuarios ────────────────────────────────────────
  describe('POST /api/usuarios', () => {
    it('debe crear un usuario', () => {
      return request(app.getHttpServer())
        .post('/api/usuarios')
        .send({
          nombre: 'Test User',
          email: 'test@padelone.com',
          celular: '099111222',
          password: 'Test123!',
          sucursal_id: sucursalId,
        })
        .expect(201)
        .then((res) => {
          usuarioId = res.body.id;
          expect(res.body.email).toBe('test@padelone.com');
          expect(res.body.contrasena).not.toBe('Test123!');
        });
    });

    it('debe rechazar email duplicado', () => {
      return request(app.getHttpServer())
        .post('/api/usuarios')
        .send({
          nombre: 'Duplicado',
          email: 'test@padelone.com',
          celular: '099333444',
          password: 'Test123!',
          sucursal_id: sucursalId,
        })
        .expect(409);
    });

    it('debe rechazar campos no permitidos', () => {
      return request(app.getHttpServer())
        .post('/api/usuarios')
        .send({
          nombre: 'Otro',
          email: 'otro@test.com',
          celular: '099555666',
          password: 'Test123!',
          sucursal_id: sucursalId,
          rol: 'admin',
        })
        .expect(400);
    });
  });

  // ─── Auth ────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('debe retornar un access_token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@padelone.com', password: 'Test123!' })
        .expect(201)
        .then((res) => {
          token = res.body.access_token;
          expect(token).toBeDefined();
        });
    });

    it('debe rechazar credenciales inválidas', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@padelone.com', password: 'wrongpass' })
        .expect(401);
    });

    it('debe rechazar usuario inexistente', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'noexiste@test.com', password: 'Test123!' })
        .expect(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('debe retornar perfil con token válido', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.email).toBe('test@padelone.com');
        });
    });

    it('debe rechazar sin token', () => {
      return request(app.getHttpServer()).get('/api/auth/profile').expect(401);
    });
  });

  // ─── Canchas ─────────────────────────────────────────
  describe('Canchas CRUD', () => {
    it('POST /api/canchas - debe crear una cancha', () => {
      return request(app.getHttpServer())
        .post('/api/canchas')
        .send({
          nombre: 'Cancha 1',
          descripcion: 'Cancha principal techada',
          hora_apertura: '08:00',
          hora_cierre: '22:00',
          total_slots: 14,
          sucursal_id: sucursalId,
        })
        .expect(201)
        .then((res) => {
          canchaId = res.body.id;
          expect(res.body.nombre).toBe('Cancha 1');
        });
    });

    it('GET /api/canchas - debe listar canchas', () => {
      return request(app.getHttpServer())
        .get('/api/canchas')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /api/canchas?sucursal_id - debe filtrar', () => {
      return request(app.getHttpServer())
        .get(`/api/canchas?sucursal_id=${sucursalId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });
  });

  // ─── Coaches ──────────────────────────────────────────
  describe('Coaches CRUD', () => {
    it('POST /api/coaches - debe crear un coach', () => {
      return request(app.getHttpServer())
        .post('/api/coaches')
        .send({
          nombre: 'Carlos Coach',
          email: 'carlos@padelone.com',
          sucursal_id: sucursalId,
        })
        .expect(201)
        .then((res) => {
          coachId = res.body.id;
          expect(res.body.nombre).toBe('Carlos Coach');
        });
    });

    it('GET /api/coaches - debe listar coaches', () => {
      return request(app.getHttpServer())
        .get('/api/coaches')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  // ─── Planes Membresía ─────────────────────────────────
  describe('Planes Membresía CRUD', () => {
    it('POST /api/planes-membresia - debe crear un plan', () => {
      return request(app.getHttpServer())
        .post('/api/planes-membresia')
        .send({
          nombre: 'Plan Básico',
          clases_incluidas: 8,
          torneos_incluidos: 2,
          permite_cancha: true,
          precio: 1500,
        })
        .expect(201)
        .then((res) => {
          planId = res.body.id;
          expect(res.body.nombre).toBe('Plan Básico');
        });
    });

    it('GET /api/planes-membresia - debe listar planes', () => {
      return request(app.getHttpServer())
        .get('/api/planes-membresia')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  // ─── Membresías Usuario ───────────────────────────────
  describe('Membresías Usuario', () => {
    it('POST /api/membresias-usuario - debe crear membresía', () => {
      return request(app.getHttpServer())
        .post('/api/membresias-usuario')
        .send({
          usuario_id: usuarioId,
          plan_id: planId,
          fecha_inicio: '2026-04-01',
          fecha_fin: '2026-05-01',
        })
        .expect(201)
        .then((res) => {
          membresiaId = res.body.id;
          expect(res.body.status).toBe('activo');
          expect(res.body.clases_restantes).toBe(8);
          expect(res.body.torneos_restantes).toBe(2);
        });
    });

    it('PATCH /api/membresias-usuario/:id - debe actualizar', () => {
      return request(app.getHttpServer())
        .patch(`/api/membresias-usuario/${membresiaId}`)
        .send({ status: 'inactivo' })
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('inactivo');
        });
    });
  });

  // ─── Clases ───────────────────────────────────────────
  describe('Clases CRUD', () => {
    it('POST /api/clases - debe crear una clase', () => {
      return request(app.getHttpServer())
        .post('/api/clases')
        .send({
          sucursal_id: sucursalId,
          coach_id: coachId,
          cancha_id: canchaId,
          tipo: 'Principiante',
          fecha: '2026-04-20',
          hora_inicio: '10:00',
          hora_fin: '11:00',
          capacidad_maxima: 8,
        })
        .expect(201)
        .then((res) => {
          claseId = res.body.id;
          expect(res.body.capacidad_actual).toBe(0);
        });
    });

    it('GET /api/clases - debe listar clases', () => {
      return request(app.getHttpServer())
        .get('/api/clases')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /api/clases/:id - debe retornar una clase', () => {
      return request(app.getHttpServer())
        .get(`/api/clases/${claseId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(claseId);
        });
    });
  });

  // ─── Reservas Clase ───────────────────────────────────
  describe('Reservas Clase', () => {
    it('POST /api/reservas-clase - debe reservar', () => {
      return request(app.getHttpServer())
        .post('/api/reservas-clase')
        .send({
          usuario_id: usuarioId,
          clase_id: claseId,
          cantidad_personas: 2,
        })
        .expect(201)
        .then((res) => {
          reservaClaseId = res.body.id;
          expect(res.body.status).toBe('confirmada');
        });
    });

    it('POST /api/reservas-clase - debe rechazar si no hay cupo', () => {
      return request(app.getHttpServer())
        .post('/api/reservas-clase')
        .send({
          usuario_id: usuarioId,
          clase_id: claseId,
          cantidad_personas: 4,
        })
        .expect(201) // Aún hay cupo (8 - 2 = 6 >= 4)
        .then(async () => {
          // Ahora solo quedan 2 lugares, intentar reservar 3 debe fallar
          return request(app.getHttpServer())
            .post('/api/reservas-clase')
            .send({
              usuario_id: usuarioId,
              clase_id: claseId,
              cantidad_personas: 3,
            })
            .expect(400);
        });
    });

    it('GET /api/reservas-clase - debe listar reservas', () => {
      return request(app.getHttpServer())
        .get('/api/reservas-clase')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('PATCH /api/reservas-clase/:id/cancelar - debe cancelar', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas-clase/${reservaClaseId}/cancelar`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('cancelada');
        });
    });

    it('PATCH /api/reservas-clase/:id/cancelar - no debe cancelar dos veces', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas-clase/${reservaClaseId}/cancelar`)
        .expect(400);
    });
  });

  // ─── Torneos ──────────────────────────────────────────
  describe('Torneos CRUD', () => {
    it('POST /api/torneos - debe crear un torneo', () => {
      return request(app.getHttpServer())
        .post('/api/torneos')
        .send({
          sucursal_id: sucursalId,
          nombre: 'Torneo Abril',
          fecha: '2026-04-25',
          hora_inicio: '09:00',
          hora_fin: '18:00',
          categoria: 'Varonil',
          capacidad_maxima: 16,
        })
        .expect(201)
        .then((res) => {
          torneoId = res.body.id;
          expect(res.body.lugares_disponibles).toBe(16);
        });
    });

    it('GET /api/torneos - debe listar torneos', () => {
      return request(app.getHttpServer())
        .get('/api/torneos')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  // ─── Reservas Torneo ──────────────────────────────────
  describe('Reservas Torneo', () => {
    it('POST /api/reservas-torneo - debe inscribir', () => {
      return request(app.getHttpServer())
        .post('/api/reservas-torneo')
        .send({
          usuario_id: usuarioId,
          torneo_id: torneoId,
        })
        .expect(201)
        .then((res) => {
          reservaTorneoId = res.body.id;
          expect(res.body.status).toBe('confirmada');
        });
    });

    it('GET /api/reservas-torneo - debe listar', () => {
      return request(app.getHttpServer())
        .get('/api/reservas-torneo')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('PATCH /api/reservas-torneo/:id/cancelar - debe cancelar', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas-torneo/${reservaTorneoId}/cancelar`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('cancelada');
        });
    });
  });

  // ─── Reservas Cancha ──────────────────────────────────
  describe('Reservas Cancha', () => {
    it('POST /api/reservas-cancha - debe reservar', () => {
      return request(app.getHttpServer())
        .post('/api/reservas-cancha')
        .send({
          usuario_id: usuarioId,
          cancha_id: canchaId,
          fecha: '2026-04-20',
          hora_inicio: '14:00',
          hora_fin: '15:00',
          duracion_min: '60',
        })
        .expect(201)
        .then((res) => {
          reservaCanchaId = res.body.id;
          expect(res.body.status).toBe('confirmada');
        });
    });

    it('POST /api/reservas-cancha - debe rechazar conflicto de horario', () => {
      return request(app.getHttpServer())
        .post('/api/reservas-cancha')
        .send({
          usuario_id: usuarioId,
          cancha_id: canchaId,
          fecha: '2026-04-20',
          hora_inicio: '14:30',
          hora_fin: '15:30',
          duracion_min: '60',
        })
        .expect(400);
    });

    it('GET /api/reservas-cancha - debe listar', () => {
      return request(app.getHttpServer())
        .get('/api/reservas-cancha')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /api/reservas-cancha/:id - debe retornar detalle', () => {
      return request(app.getHttpServer())
        .get(`/api/reservas-cancha/${reservaCanchaId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(reservaCanchaId);
        });
    });

    it('PATCH /api/reservas-cancha/:id/cancelar - debe cancelar', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas-cancha/${reservaCanchaId}/cancelar`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('cancelada');
        });
    });
  });

  // ─── Usuarios CRUD adicional ──────────────────────────
  describe('Usuarios CRUD', () => {
    it('GET /api/usuarios - debe listar usuarios', () => {
      return request(app.getHttpServer())
        .get('/api/usuarios')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /api/usuarios/:id - debe retornar un usuario', () => {
      return request(app.getHttpServer())
        .get(`/api/usuarios/${usuarioId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(usuarioId);
        });
    });

    it('PATCH /api/usuarios/:id - debe actualizar', () => {
      return request(app.getHttpServer())
        .patch(`/api/usuarios/${usuarioId}`)
        .send({ nombre: 'Actualizado' })
        .expect(200)
        .then((res) => {
          expect(res.body.nombre).toBe('Actualizado');
        });
    });
  });

  // ─── Estudios CRUD adicional ──────────────────────────
  describe('Estudios CRUD', () => {
    it('GET /api/estudios - debe listar estudios', () => {
      return request(app.getHttpServer())
        .get('/api/estudios')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('PATCH /api/estudios/:id - debe actualizar', () => {
      return request(app.getHttpServer())
        .patch(`/api/estudios/${estudioId}`)
        .send({ nombre: 'Pádel One Actualizado' })
        .expect(200)
        .then((res) => {
          expect(res.body.nombre).toBe('Pádel One Actualizado');
        });
    });
  });
});
