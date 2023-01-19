/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `TaskPriority` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `TaskSeverity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `TaskStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `TaskPriority` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `TaskSeverity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `TaskStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskPriority" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskSeverity" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskStatus" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TaskPriority_code_key" ON "TaskPriority"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TaskSeverity_code_key" ON "TaskSeverity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_code_key" ON "TaskStatus"("code");
