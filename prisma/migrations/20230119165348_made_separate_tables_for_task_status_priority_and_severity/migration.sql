/*
  Warnings:

  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severityId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority",
DROP COLUMN "severity",
DROP COLUMN "status",
ADD COLUMN     "priorityId" INTEGER NOT NULL,
ADD COLUMN     "severityId" INTEGER NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TaskSeverity" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "TaskSeverity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "TaskStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskPriority" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "TaskPriority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskSeverity_id_key" ON "TaskSeverity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_id_key" ON "TaskStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskPriority_id_key" ON "TaskPriority"("id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "TaskPriority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_severityId_fkey" FOREIGN KEY ("severityId") REFERENCES "TaskSeverity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TaskStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
