/*
  Warnings:

  - You are about to drop the column `idADmin` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "idADmin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
