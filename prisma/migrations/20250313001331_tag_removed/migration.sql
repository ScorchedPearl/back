/*
  Warnings:

  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DiaryTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReplyTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DiaryTags" DROP CONSTRAINT "_DiaryTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiaryTags" DROP CONSTRAINT "_DiaryTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostTags" DROP CONSTRAINT "_PostTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostTags" DROP CONSTRAINT "_PostTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReplyTags" DROP CONSTRAINT "_ReplyTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReplyTags" DROP CONSTRAINT "_ReplyTags_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "title",
ALTER COLUMN "imageURL" DROP NOT NULL;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_DiaryTags";

-- DropTable
DROP TABLE "_PostTags";

-- DropTable
DROP TABLE "_ReplyTags";
