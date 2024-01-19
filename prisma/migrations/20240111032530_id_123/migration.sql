-- DropIndex
DROP INDEX "Todo_title_key";

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "title" DROP NOT NULL;
