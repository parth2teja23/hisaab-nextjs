/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");
