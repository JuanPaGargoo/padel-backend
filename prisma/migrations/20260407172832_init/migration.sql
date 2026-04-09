-- CreateEnum
CREATE TYPE "MembresiaStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "ClaseTipo" AS ENUM ('Principiante', 'Intermedio', 'Avanzado', 'Clinica');

-- CreateEnum
CREATE TYPE "ReservaClaseStatus" AS ENUM ('confirmada', 'cancelada', 'pendiente');

-- CreateEnum
CREATE TYPE "ReservaStatus" AS ENUM ('confirmada', 'cancelada');

-- CreateEnum
CREATE TYPE "TorneoCategoria" AS ENUM ('Varonil', 'Femenil', 'Mixto');

-- CreateEnum
CREATE TYPE "DuracionMin" AS ENUM ('60', '90', '120');

-- CreateTable
CREATE TABLE "estudios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "logo_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "estudios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursales" (
    "id" SERIAL NOT NULL,
    "estudio_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(10) NOT NULL,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "celular" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canchas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "hora_apertura" VARCHAR(5) NOT NULL,
    "hora_cierre" VARCHAR(5) NOT NULL,
    "total_slots" INTEGER NOT NULL,

    CONSTRAINT "canchas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_membresia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "clases_incluidas" INTEGER NOT NULL,
    "torneos_incluidos" INTEGER NOT NULL,
    "permite_cancha" BOOLEAN NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "planes_membresia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membresias_usuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "status" "MembresiaStatus" NOT NULL,
    "clases_restantes" INTEGER NOT NULL,
    "torneos_restantes" INTEGER NOT NULL,

    CONSTRAINT "membresias_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clases" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "coach_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "tipo" "ClaseTipo" NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" VARCHAR(5) NOT NULL,
    "hora_fin" VARCHAR(5) NOT NULL,
    "capacidad_maxima" INTEGER NOT NULL,
    "capacidad_actual" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_clase" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "clase_id" INTEGER NOT NULL,
    "cantidad_personas" INTEGER NOT NULL,
    "status" "ReservaClaseStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_cancha" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" VARCHAR(5) NOT NULL,
    "hora_fin" VARCHAR(5) NOT NULL,
    "duracion_min" "DuracionMin" NOT NULL,
    "status" "ReservaStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" VARCHAR(5) NOT NULL,
    "hora_fin" VARCHAR(5) NOT NULL,
    "categoria" "TorneoCategoria" NOT NULL,
    "capacidad_maxima" INTEGER NOT NULL,
    "lugares_disponibles" INTEGER NOT NULL,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_torneo" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "torneo_id" INTEGER NOT NULL,
    "status" "ReservaStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_torneo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera_clase" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "clase_id" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lista_espera_clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera_torneo" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "torneo_id" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lista_espera_torneo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera_cancha" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" VARCHAR(5) NOT NULL,
    "hora_fin" VARCHAR(5) NOT NULL,
    "posicion" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lista_espera_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "sucursales" ADD CONSTRAINT "sucursales_estudio_id_fkey" FOREIGN KEY ("estudio_id") REFERENCES "estudios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canchas" ADD CONSTRAINT "canchas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias_usuario" ADD CONSTRAINT "membresias_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias_usuario" ADD CONSTRAINT "membresias_usuario_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes_membresia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "canchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_clase" ADD CONSTRAINT "reservas_clase_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_clase" ADD CONSTRAINT "reservas_clase_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_cancha" ADD CONSTRAINT "reservas_cancha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_cancha" ADD CONSTRAINT "reservas_cancha_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "canchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "torneos" ADD CONSTRAINT "torneos_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_torneo" ADD CONSTRAINT "reservas_torneo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_torneo" ADD CONSTRAINT "reservas_torneo_torneo_id_fkey" FOREIGN KEY ("torneo_id") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_clase" ADD CONSTRAINT "lista_espera_clase_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_clase" ADD CONSTRAINT "lista_espera_clase_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_torneo" ADD CONSTRAINT "lista_espera_torneo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_torneo" ADD CONSTRAINT "lista_espera_torneo_torneo_id_fkey" FOREIGN KEY ("torneo_id") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_cancha" ADD CONSTRAINT "lista_espera_cancha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera_cancha" ADD CONSTRAINT "lista_espera_cancha_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "canchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
