/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "status" TEXT,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);
