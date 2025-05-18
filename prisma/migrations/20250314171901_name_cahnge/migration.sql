/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Reply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "imageUrl",
ADD COLUMN     "imageURL" TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "imageUrl",
ADD COLUMN     "imageURL" TEXT;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "imageUrl",
ADD COLUMN     "imageURL" TEXT;
