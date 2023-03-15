/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Personality_name_key" ON "Personality"("name");
