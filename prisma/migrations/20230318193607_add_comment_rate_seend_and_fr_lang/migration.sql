-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "frenchDesc" STRING;
ALTER TABLE "Video" ADD COLUMN     "frenchStoryline" STRING;
ALTER TABLE "Video" ADD COLUMN     "frenchTitle" STRING;

-- CreateTable
CREATE TABLE "Comment" (
    "id" STRING NOT NULL,
    "content" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "videoId" STRING NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" STRING NOT NULL,
    "note" INT4 NOT NULL,
    "userId" STRING NOT NULL,
    "videoId" STRING NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHaveSeenVideo" (
    "id" STRING NOT NULL,
    "hasSeen" BOOL NOT NULL,
    "userId" STRING NOT NULL,
    "videoId" STRING NOT NULL,

    CONSTRAINT "UserHaveSeenVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_videoId_key" ON "Rating"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHaveSeenVideo_userId_videoId_key" ON "UserHaveSeenVideo"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHaveSeenVideo" ADD CONSTRAINT "UserHaveSeenVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHaveSeenVideo" ADD CONSTRAINT "UserHaveSeenVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
