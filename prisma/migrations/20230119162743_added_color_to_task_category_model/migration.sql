/*
  Warnings:

  - Added the required column `color` to the `TaskCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskCategory" ADD COLUMN     "color" VARCHAR(7) NOT NULL;
