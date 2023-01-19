-- CreateTable
CREATE TABLE "TaskCommentAttachment" (
    "id" SERIAL NOT NULL,
    "taskCommentId" INTEGER NOT NULL,
    "isImage" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,

    CONSTRAINT "TaskCommentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskCommentAttachment_id_key" ON "TaskCommentAttachment"("id");

-- AddForeignKey
ALTER TABLE "TaskCommentAttachment" ADD CONSTRAINT "TaskCommentAttachment_taskCommentId_fkey" FOREIGN KEY ("taskCommentId") REFERENCES "TaskComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
