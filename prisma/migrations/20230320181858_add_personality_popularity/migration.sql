/*
  Warnings:

  - Added the required column `popularity` to the `Personality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personality" ADD COLUMN     "popularity" FLOAT8 NOT NULL;
