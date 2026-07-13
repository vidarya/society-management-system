-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityBooking" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "bookedById" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_name_key" ON "Facility"("name");

-- AddForeignKey
ALTER TABLE "FacilityBooking" ADD CONSTRAINT "FacilityBooking_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityBooking" ADD CONSTRAINT "FacilityBooking_bookedById_fkey" FOREIGN KEY ("bookedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
