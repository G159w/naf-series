/*
  Warnings:

  - You are about to drop the column `year` on the `Video` table. All the data in the column will be lost.
  - Added the required column `endYear` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "year";
ALTER TABLE "Video" ADD COLUMN     "endYear" INT4 NOT NULL;
ALTER TABLE "Video" ADD COLUMN     "startYear" INT4 NOT NULL;
