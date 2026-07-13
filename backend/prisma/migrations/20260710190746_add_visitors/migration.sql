-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('PENDING', 'APPROVED', 'CHECKED_IN', 'CHECKED_OUT', 'REJECTED');

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "vehicleNumber" TEXT,
    "status" "VisitorStatus" NOT NULL DEFAULT 'PENDING',
    "flatId" TEXT NOT NULL,
    "approvedById" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3),
    "exitTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_qrCode_key" ON "Visitor"("qrCode");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Flat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
