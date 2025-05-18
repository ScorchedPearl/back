/*
  Warnings:

  - You are about to drop the column `date` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Reply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "date",
DROP COLUMN "public";

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "date",
DROP COLUMN "public";
