/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,postId,commentId,replyId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "replyId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_commentId_replyId_key" ON "Like"("userId", "postId", "commentId", "replyId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
