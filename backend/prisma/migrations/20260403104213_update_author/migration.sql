/*
  Warnings:

  - Made the column `author` on table `PullRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PullRequest" ALTER COLUMN "author" SET NOT NULL;
