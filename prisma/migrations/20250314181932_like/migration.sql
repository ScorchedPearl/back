/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,postId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,replyId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Like` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Like_userId_postId_commentId_replyId_key";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_commentId_key" ON "Like"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_replyId_key" ON "Like"("userId", "replyId");
