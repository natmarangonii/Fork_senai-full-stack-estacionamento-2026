/*
  Warnings:

  - Made the column `telefone` on table `automovel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `automovel` MODIFY `telefone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `estadia` MODIFY `entrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Estadia` ADD CONSTRAINT `Estadia_placa_fkey` FOREIGN KEY (`placa`) REFERENCES `Automovel`(`placa`) ON DELETE RESTRICT ON UPDATE CASCADE;
