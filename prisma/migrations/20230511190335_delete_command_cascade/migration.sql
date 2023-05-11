-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoClubId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_videoClubId_fkey" FOREIGN KEY ("videoClubId") REFERENCES "VideoClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
