/*
  Warnings:

  - A unique constraint covering the columns `[order,character]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_order_character_key" ON "Role"("order", "character");
