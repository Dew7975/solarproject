/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "createdAt",
ADD COLUMN     "installerOrganizationId" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_installerOrganizationId_fkey" FOREIGN KEY ("installerOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
