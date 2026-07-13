/*
  Warnings:

  - You are about to drop the column `entryTime` on the `Visitor` table. All the data in the column will be lost.
  - You are about to drop the column `exitTime` on the `Visitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "entryTime",
DROP COLUMN "exitTime";

-- CreateTable
CREATE TABLE "VisitorLog" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" TIMESTAMP(3),

    CONSTRAINT "VisitorLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitorLog" ADD CONSTRAINT "VisitorLog_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
