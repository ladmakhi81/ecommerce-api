-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Customer', 'Vendor', 'Admin');

-- CreateEnum
CREATE TYPE "ProductPriceType" AS ENUM ('Color');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Processing', 'Shipped', 'OutOfDelivery', 'Delivered');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Payed', 'NotPayed', 'Canceled');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Deposit', 'Withdraw', 'Revenue', 'Return');

-- CreateEnum
CREATE TYPE "ReturnedOrderStatus" AS ENUM ('Pending', 'Seen', 'Processed', 'Accept', 'Reject');

-- CreateTable
CREATE TABLE "_users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerifiedAccount" BOOLEAN NOT NULL DEFAULT false,
    "verifiedDate" TIMESTAMP(3),
    "verifiedToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastLoginDate" TIMESTAMP(3),
    "currentAddressId" INTEGER,

    CONSTRAINT "_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_user_sessions" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "_user_sessions_pkey" PRIMARY KEY ("userId","token")
);

-- CreateTable
CREATE TABLE "_user_addresses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "_user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedDate" TIMESTAMP(3),
    "verifiedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "previewImage" TEXT NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_product_price_items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isVisible" BOOLEAN NOT NULL,
    "type" "ProductPriceType" NOT NULL,

    CONSTRAINT "_product_price_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductWhishlist" (
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProductWhishlist_pkey" PRIMARY KEY ("productId","userId")
);

-- CreateTable
CREATE TABLE "UserProductHistoryView" (
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserProductHistoryView_pkey" PRIMARY KEY ("productId","userId")
);

-- CreateTable
CREATE TABLE "_carts" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "priceItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER,

    CONSTRAINT "_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_orders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,
    "userAddressId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL,
    "statusChangedAt" TIMESTAMP(3) NOT NULL,
    "deliveryCode" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,

    CONSTRAINT "_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_payments" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "payedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PaymentStatus" NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_transactions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL,
    "authority" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_returned_orders" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReturnedOrderStatus" NOT NULL,
    "statusChangedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "_returned_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_email_key" ON "_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_users_currentAddressId_key" ON "_users"("currentAddressId");

-- CreateIndex
CREATE INDEX "_users_email_idx" ON "_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_user_sessions_userId_key" ON "_user_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_user_sessions_token_key" ON "_user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_categories_name_key" ON "_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_orders_deliveryCode_key" ON "_orders"("deliveryCode");

-- CreateIndex
CREATE INDEX "_orders_deliveryCode_idx" ON "_orders"("deliveryCode");

-- CreateIndex
CREATE UNIQUE INDEX "_transactions_paymentId_key" ON "_transactions"("paymentId");

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_currentAddressId_fkey" FOREIGN KEY ("currentAddressId") REFERENCES "_user_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_sessions" ADD CONSTRAINT "_user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_addresses" ADD CONSTRAINT "_user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_products" ADD CONSTRAINT "_products_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_products" ADD CONSTRAINT "_products_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_products" ADD CONSTRAINT "_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWhishlist" ADD CONSTRAINT "ProductWhishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWhishlist" ADD CONSTRAINT "ProductWhishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProductHistoryView" ADD CONSTRAINT "UserProductHistoryView_productId_fkey" FOREIGN KEY ("productId") REFERENCES "_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProductHistoryView" ADD CONSTRAINT "UserProductHistoryView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_carts" ADD CONSTRAINT "_carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_carts" ADD CONSTRAINT "_carts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_carts" ADD CONSTRAINT "_carts_priceItemId_fkey" FOREIGN KEY ("priceItemId") REFERENCES "_product_price_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_carts" ADD CONSTRAINT "_carts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_orders" ADD CONSTRAINT "_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_orders" ADD CONSTRAINT "_orders_userAddressId_fkey" FOREIGN KEY ("userAddressId") REFERENCES "_user_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_orders" ADD CONSTRAINT "_orders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_payments" ADD CONSTRAINT "_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_payments" ADD CONSTRAINT "_payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transactions" ADD CONSTRAINT "_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transactions" ADD CONSTRAINT "_transactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_returned_orders" ADD CONSTRAINT "_returned_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_returned_orders" ADD CONSTRAINT "_returned_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
