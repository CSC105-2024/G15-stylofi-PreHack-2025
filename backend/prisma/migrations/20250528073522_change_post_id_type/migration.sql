/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_PostTag` DROP FOREIGN KEY `_PostTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserLikes` DROP FOREIGN KEY `_UserLikes_A_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `_PostTag` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_UserLikes` MODIFY `A` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `_PostTag` ADD CONSTRAINT `_PostTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserLikes` ADD CONSTRAINT `_UserLikes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
