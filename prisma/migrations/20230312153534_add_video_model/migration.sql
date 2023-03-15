-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('Movie', 'Series');

-- CreateTable
CREATE TABLE "Personality" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "videoId" STRING,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" STRING NOT NULL,
    "imageUrl" STRING,
    "title" STRING NOT NULL,
    "type" "VideoType" NOT NULL,
    "year" INT4 NOT NULL,
    "imdbRating" FLOAT8,
    "genres" STRING[],
    "storyline" STRING,
    "desc" STRING,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_createdVideos" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_starredVideos" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_createdVideos_AB_unique" ON "_createdVideos"("A", "B");

-- CreateIndex
CREATE INDEX "_createdVideos_B_index" ON "_createdVideos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_starredVideos_AB_unique" ON "_starredVideos"("A", "B");

-- CreateIndex
CREATE INDEX "_starredVideos_B_index" ON "_starredVideos"("B");

-- AddForeignKey
ALTER TABLE "_createdVideos" ADD CONSTRAINT "_createdVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "Personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_createdVideos" ADD CONSTRAINT "_createdVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_starredVideos" ADD CONSTRAINT "_starredVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "Personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_starredVideos" ADD CONSTRAINT "_starredVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
