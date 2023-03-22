/*
  Warnings:

  - You are about to drop the `UserHaveSeenVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_starredVideos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserHaveSeenVideo" DROP CONSTRAINT "UserHaveSeenVideo_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHaveSeenVideo" DROP CONSTRAINT "UserHaveSeenVideo_videoId_fkey";

-- DropForeignKey
ALTER TABLE "_starredVideos" DROP CONSTRAINT "_starredVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "_starredVideos" DROP CONSTRAINT "_starredVideos_B_fkey";

-- DropTable
DROP TABLE "UserHaveSeenVideo";

-- DropTable
DROP TABLE "_starredVideos";

-- CreateTable
CREATE TABLE "Role" (
    "id" STRING NOT NULL,
    "order" INT4 NOT NULL,
    "character" STRING NOT NULL,
    "actorId" STRING NOT NULL,
    "videoId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_actorId_videoId_key" ON "Role"("actorId", "videoId");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Personality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
