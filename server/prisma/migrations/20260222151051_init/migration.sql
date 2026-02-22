/*
  Warnings:

  - You are about to alter the column `timeStamp` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "timeStamp" SET DATA TYPE INTEGER;
