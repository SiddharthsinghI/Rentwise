-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'customer',
    `avatar` TEXT NULL,
    `phone` VARCHAR(50) NULL,
    `location` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `businessName` VARCHAR(191) NULL,
    `memberSince` VARCHAR(50) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 5.0,
    `reviewsCount` INTEGER NOT NULL DEFAULT 0,
    `verified` BOOLEAN NOT NULL DEFAULT true,
    `responseTime` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `pricePerDay` DECIMAL(10, 2) NOT NULL,
    `securityDeposit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `totalQuantity` INTEGER NOT NULL DEFAULT 1,
    `availability` VARCHAR(50) NOT NULL DEFAULT 'available',
    `condition` VARCHAR(50) NOT NULL DEFAULT 'Like New',
    `rating` DOUBLE NOT NULL DEFAULT 5.0,
    `reviewsCount` INTEGER NOT NULL DEFAULT 0,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `popular` BOOLEAN NOT NULL DEFAULT false,
    `images` JSON NOT NULL,
    `description` TEXT NOT NULL,
    `features` JSON NOT NULL,
    `specs` JSON NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT 'United States',
    `inclusions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `products_vendorId_idx`(`vendorId`),
    INDEX `products_category_idx`(`category`),
    INDEX `products_availability_idx`(`availability`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(255) NOT NULL,
    `productImage` TEXT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `vendorName` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(20) NOT NULL,
    `endDate` VARCHAR(20) NOT NULL,
    `totalDays` INTEGER NOT NULL,
    `dailyRate` DECIMAL(10, 2) NOT NULL,
    `baseCost` DECIMAL(10, 2) NOT NULL,
    `serviceFee` DECIMAL(10, 2) NOT NULL,
    `securityDeposit` DECIMAL(10, 2) NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `customerNotes` TEXT NULL,
    `destination` VARCHAR(255) NULL,
    `rejectionReason` TEXT NULL,
    `vendorFeedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `bookings_productId_idx`(`productId`),
    INDEX `bookings_customerId_idx`(`customerId`),
    INDEX `bookings_vendorId_idx`(`vendorId`),
    INDEX `bookings_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist_items` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `wishlist_items_userId_idx`(`userId`),
    INDEX `wishlist_items_productId_idx`(`productId`),
    UNIQUE INDEX `wishlist_items_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

