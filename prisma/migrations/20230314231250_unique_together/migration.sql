/*
  Warnings:

  - A unique constraint covering the columns `[title,type]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_title_type_key" ON "Video"("title", "type");
