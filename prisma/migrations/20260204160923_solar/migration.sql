/*
  Warnings:

  - You are about to drop the column `installerId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `installerOrganizationId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_installerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_installerOrganizationId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "installerId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "installerOrganizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_installerOrganizationId_fkey" FOREIGN KEY ("installerOrganizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
