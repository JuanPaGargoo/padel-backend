-- DropForeignKey
ALTER TABLE "reservas_torneo" DROP CONSTRAINT "reservas_torneo_torneo_id_fkey";

-- AddForeignKey
ALTER TABLE "reservas_torneo" ADD CONSTRAINT "reservas_torneo_torneo_id_fkey" FOREIGN KEY ("torneo_id") REFERENCES "torneos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
