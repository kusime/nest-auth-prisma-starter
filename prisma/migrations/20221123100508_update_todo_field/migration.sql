/*
  Warnings:

  - You are about to drop the column `todos` on the `Todos` table. All the data in the column will be lost.
  - Added the required column `content` to the `Todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Todos` DROP COLUMN `todos`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL;
