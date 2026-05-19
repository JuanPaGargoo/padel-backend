import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('Seeding database...');

  // Limpiar datos existentes (en orden inverso por FK)
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
  console.log('Datos anteriores eliminados.');

  // Estudio
  const estudio = await prisma.estudio.create({
    data: {
      nombre: 'Pádel One',
      logo_url: 'https://padelone.com/logo.png',
    },
  });
  console.log(`Estudio creado: ${estudio.nombre} (id: ${estudio.id})`);

  // Sucursal
  const sucursal = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Central',
      direccion: 'Av. Principal 123',
      ciudad: 'Monterrey',
      estado: 'Nuevo León',
      codigo_postal: '64000',
      estudio_id: estudio.id,
    },
  });
  console.log(`Sucursal creada: ${sucursal.nombre} (id: ${sucursal.id})`);

  // Usuario admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const usuario = await prisma.usuario.create({
    data: {
      nombre: 'Admin Pádel One',
      email: 'admin@padelone.com',
      celular: '099000000',
      contrasena: hashedPassword,
      sucursal_id: sucursal.id,
    },
  });
  console.log(`Usuario creado: ${usuario.nombre} (id: ${usuario.id})`);

  // Cancha
  const cancha = await prisma.cancha.create({
    data: {
      nombre: 'Cancha 1',
      descripcion: 'Cancha principal techada',
      hora_apertura: '08:00',
      hora_cierre: '22:00',
      total_slots: 14,
      sucursal_id: sucursal.id,
    },
  });
  console.log(`Cancha creada: ${cancha.nombre} (id: ${cancha.id})`);

  // Coach
  const coach = await prisma.coach.create({
    data: {
      nombre: 'Carlos Coach',
      email: 'carlos@padelone.com',
      sucursal_id: sucursal.id,
    },
  });
  console.log(`Coach creado: ${coach.nombre} (id: ${coach.id})`);

  // Coach con login (app coachEmails)
  const coachAppHashed = await bcrypt.hash('Coach123!', 10);
  const coachApp = await prisma.coach.create({
    data: {
      nombre: 'Coach Padel One',
      email: 'coach@padelone.com',
      sucursal_id: sucursal.id,
    },
  });
  const coachAppUser = await prisma.usuario.create({
    data: {
      nombre: 'Coach Padel One',
      email: 'coach@padelone.com',
      celular: '099000001',
      contrasena: coachAppHashed,
      sucursal_id: sucursal.id,
    },
  });
  console.log(
    `Coach app: ${coachApp.email} (coach_id=${coachApp.id}, usuario_id=${coachAppUser.id})`,
  );

  // Clases asignadas al coach app
  const hoy = new Date();
  const tipos: Array<'Principiante' | 'Intermedio' | 'Avanzado' | 'Clinica'> = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Clinica',
  ];
  for (let i = 0; i < tipos.length; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + i);
    await prisma.clase.create({
      data: {
        sucursal_id: sucursal.id,
        coach_id: coachApp.id,
        cancha_id: cancha.id,
        tipo: tipos[i],
        fecha,
        hora_inicio: `${10 + i}:00`,
        hora_fin: `${11 + i}:00`,
        capacidad_maxima: 6,
      },
    });
  }
  console.log(`Clases creadas para ${coachApp.email}: ${tipos.length}`);

  // Plan de membresía
  const plan = await prisma.planMembresia.create({
    data: {
      nombre: 'Plan Básico',
      clases_incluidas: 8,
      torneos_incluidos: 2,
      permite_cancha: true,
      precio: 1500,
    },
  });
  console.log(`Plan creado: ${plan.nombre} (id: ${plan.id})`);

  console.log('\nSeed completado exitosamente!');
  console.log('-----------------------------------');
  console.log('Credenciales de acceso:');
  console.log('  Admin Email:    admin@padelone.com');
  console.log('  Admin Password: Admin123!');
  console.log('  Coach Email:    coach@padelone.com');
  console.log('  Coach Password: Coach123!');
  console.log('-----------------------------------');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
