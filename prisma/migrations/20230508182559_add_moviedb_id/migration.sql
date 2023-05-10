/*
  Warnings:

  - A unique constraint covering the columns `[movieDbId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movieDbId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "movieDbId" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_movieDbId_key" ON "Video"("movieDbId");
