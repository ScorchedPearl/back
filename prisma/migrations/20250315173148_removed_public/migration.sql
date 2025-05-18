/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "published";
