/*
  Warnings:

  - A unique constraint covering the columns `[character]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_order_character_key";

-- CreateIndex
CREATE UNIQUE INDEX "Role_character_key" ON "Role"("character");
