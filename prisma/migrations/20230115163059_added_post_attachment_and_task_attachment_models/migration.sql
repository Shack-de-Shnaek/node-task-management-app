-- CreateTable
CREATE TABLE "PostAttachment" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "isImage" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,

    CONSTRAINT "PostAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAttachment" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "isImage" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,

    CONSTRAINT "TaskAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostAttachment_id_key" ON "PostAttachment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskAttachment_id_key" ON "TaskAttachment"("id");

-- AddForeignKey
ALTER TABLE "PostAttachment" ADD CONSTRAINT "PostAttachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
