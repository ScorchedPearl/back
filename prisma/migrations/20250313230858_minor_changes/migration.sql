/*
  Warnings:

  - You are about to drop the column `chatId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatId",
ADD COLUMN     "roomId" TEXT NOT NULL,
ALTER COLUMN "text" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
