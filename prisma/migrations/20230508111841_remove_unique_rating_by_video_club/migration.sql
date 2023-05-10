/*
  Warnings:

  - You are about to drop the column `videoClubId` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,videoId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_videoClubId_fkey";

-- DropIndex
DROP INDEX "Rating_userId_videoId_videoClubId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "videoClubId";

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_videoId_key" ON "Rating"("userId", "videoId");
