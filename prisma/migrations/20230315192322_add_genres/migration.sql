/*
  Warnings:

  - You are about to drop the column `genres` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "genres";

-- CreateTable
CREATE TABLE "Genre" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_videoGenres" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_videoGenres_AB_unique" ON "_videoGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_videoGenres_B_index" ON "_videoGenres"("B");

-- AddForeignKey
ALTER TABLE "_videoGenres" ADD CONSTRAINT "_videoGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_videoGenres" ADD CONSTRAINT "_videoGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
