/*
  Warnings:

  - You are about to drop the column `stockOrice` on the `StockArticle` table. All the data in the column will be lost.
  - Added the required column `stockPrice` to the `StockArticle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockArticle" DROP COLUMN "stockOrice",
ADD COLUMN     "stockPrice" INTEGER NOT NULL;
