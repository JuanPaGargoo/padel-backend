/*
  Warnings:

  - You are about to drop the `lista_espera_cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lista_espera_clase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lista_espera_torneo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lista_espera_cancha" DROP CONSTRAINT "lista_espera_cancha_cancha_id_fkey";

-- DropForeignKey
ALTER TABLE "lista_espera_cancha" DROP CONSTRAINT "lista_espera_cancha_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "lista_espera_clase" DROP CONSTRAINT "lista_espera_clase_clase_id_fkey";

-- DropForeignKey
ALTER TABLE "lista_espera_clase" DROP CONSTRAINT "lista_espera_clase_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "lista_espera_torneo" DROP CONSTRAINT "lista_espera_torneo_torneo_id_fkey";

-- DropForeignKey
ALTER TABLE "lista_espera_torneo" DROP CONSTRAINT "lista_espera_torneo_usuario_id_fkey";

-- DropTable
DROP TABLE "lista_espera_cancha";

-- DropTable
DROP TABLE "lista_espera_clase";

-- DropTable
DROP TABLE "lista_espera_torneo";
