/*
  Warnings:

  - You are about to drop the column `videoId` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `imdbRating` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `Video` table. All the data in the column will be lost.
  - Added the required column `year` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personality" DROP COLUMN "videoId";
ALTER TABLE "Personality" ADD COLUMN     "imgUrl" STRING;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "endYear";
ALTER TABLE "Video" DROP COLUMN "imdbRating";
ALTER TABLE "Video" DROP COLUMN "startYear";
ALTER TABLE "Video" ADD COLUMN     "usersRating" FLOAT8;
ALTER TABLE "Video" ADD COLUMN     "year" INT4 NOT NULL;
