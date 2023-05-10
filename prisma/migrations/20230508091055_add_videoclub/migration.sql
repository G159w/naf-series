/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId,videoClubId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoClubId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoClubId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Rating_userId_videoId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "videoClubId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "videoClubId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "VideoClub" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "inviteId" STRING NOT NULL,
    "watchId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToVideoClub" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_VideoToVideoClub" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoClub_inviteId_key" ON "VideoClub"("inviteId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoClub_watchId_key" ON "VideoClub"("watchId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVideoClub_AB_unique" ON "_UserToVideoClub"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVideoClub_B_index" ON "_UserToVideoClub"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToVideoClub_AB_unique" ON "_VideoToVideoClub"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToVideoClub_B_index" ON "_VideoToVideoClub"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_videoId_videoClubId_key" ON "Rating"("userId", "videoId", "videoClubId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_videoClubId_fkey" FOREIGN KEY ("videoClubId") REFERENCES "VideoClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_videoClubId_fkey" FOREIGN KEY ("videoClubId") REFERENCES "VideoClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideoClub" ADD CONSTRAINT "_UserToVideoClub_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideoClub" ADD CONSTRAINT "_UserToVideoClub_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToVideoClub" ADD CONSTRAINT "_VideoToVideoClub_A_fkey" FOREIGN KEY ("A") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToVideoClub" ADD CONSTRAINT "_VideoToVideoClub_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
