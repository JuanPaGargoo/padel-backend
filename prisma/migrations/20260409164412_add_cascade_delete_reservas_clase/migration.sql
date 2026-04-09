-- DropForeignKey
ALTER TABLE "reservas_clase" DROP CONSTRAINT "reservas_clase_clase_id_fkey";

-- AddForeignKey
ALTER TABLE "reservas_clase" ADD CONSTRAINT "reservas_clase_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
