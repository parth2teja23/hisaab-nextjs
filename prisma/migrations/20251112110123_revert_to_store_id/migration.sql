/*
  Warnings:

  - You are about to drop the column `slug` on the `Store` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Store_slug_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "slug";
