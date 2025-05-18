/*
  Warnings:

  - A unique constraint covering the columns `[userId,storyId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,messageId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,postId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,storyId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,commentId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,replyId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "storyId" TEXT;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "replyId" TEXT,
ADD COLUMN     "storyId" TEXT;

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageURL" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_storyId_key" ON "Like"("userId", "storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_messageId_key" ON "Reaction"("authorId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_postId_key" ON "Reaction"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_storyId_key" ON "Reaction"("authorId", "storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_commentId_key" ON "Reaction"("authorId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_replyId_key" ON "Reaction"("authorId", "replyId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
