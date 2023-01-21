/*
  Warnings:

  - You are about to drop the column `priorityId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `severityId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_priorityId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_severityId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_statusId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priorityId",
DROP COLUMN "severityId",
DROP COLUMN "statusId",
ADD COLUMN     "priorityCode" TEXT NOT NULL DEFAULT 'low',
ADD COLUMN     "severityCode" TEXT NOT NULL DEFAULT 'low',
ADD COLUMN     "statusCode" TEXT NOT NULL DEFAULT 'assigned',
ALTER COLUMN "assignedToId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_priorityCode_fkey" FOREIGN KEY ("priorityCode") REFERENCES "TaskPriority"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_severityCode_fkey" FOREIGN KEY ("severityCode") REFERENCES "TaskSeverity"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_statusCode_fkey" FOREIGN KEY ("statusCode") REFERENCES "TaskStatus"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
