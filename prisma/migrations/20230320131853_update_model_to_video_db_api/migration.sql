/*
  Warnings:

  - You are about to drop the column `date` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `frenchDesc` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `frenchStoryline` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `frenchTitle` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `storyline` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `usersRating` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,releaseDate]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adult` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalLanguage` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalTitle` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteAverage` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteCount` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_title_type_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "date";
ALTER TABLE "Video" DROP COLUMN "desc";
ALTER TABLE "Video" DROP COLUMN "frenchDesc";
ALTER TABLE "Video" DROP COLUMN "frenchStoryline";
ALTER TABLE "Video" DROP COLUMN "frenchTitle";
ALTER TABLE "Video" DROP COLUMN "imageUrl";
ALTER TABLE "Video" DROP COLUMN "storyline";
ALTER TABLE "Video" DROP COLUMN "usersRating";
ALTER TABLE "Video" DROP COLUMN "year";
ALTER TABLE "Video" ADD COLUMN     "adult" BOOL NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "backdropPath" STRING;
ALTER TABLE "Video" ADD COLUMN     "budget" FLOAT8 NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Video" ADD COLUMN     "homepage" STRING;
ALTER TABLE "Video" ADD COLUMN     "imdbId" STRING;
ALTER TABLE "Video" ADD COLUMN     "originalLanguage" STRING NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "originalTitle" STRING NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "overview" STRING;
ALTER TABLE "Video" ADD COLUMN     "popularity" FLOAT8 NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "posterPath" STRING;
ALTER TABLE "Video" ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "revenue" FLOAT8 NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "status" STRING NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "tagline" STRING;
ALTER TABLE "Video" ADD COLUMN     "voteAverage" FLOAT8 NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "voteCount" INT4 NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_title_releaseDate_key" ON "Video"("title", "releaseDate");
