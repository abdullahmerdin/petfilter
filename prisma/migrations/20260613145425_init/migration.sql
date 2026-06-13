-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "appInstalled" BOOLEAN NOT NULL DEFAULT true,
    "badgeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "badgeColor" TEXT NOT NULL DEFAULT '#008060',
    "badgeText" TEXT NOT NULL DEFAULT 'Pet Friendly',
    "buttonLabel" TEXT NOT NULL DEFAULT 'Find Compatible Friends',
    "hasSeenWelcome" BOOLEAN NOT NULL DEFAULT false,
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionId" TEXT,
    "billingPlan" TEXT NOT NULL DEFAULT 'free',
    "petButtonEnabled" BOOLEAN NOT NULL DEFAULT true,
    "petButtonColor" TEXT NOT NULL DEFAULT '#22c55e',
    "petButtonAnimation" TEXT NOT NULL DEFAULT 'pulse',
    "petButtonPosition" TEXT NOT NULL DEFAULT 'right',
    "petButtonBottomOffset" INTEGER NOT NULL DEFAULT 24,
    "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetProfile" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productHandle" TEXT,
    "productTitle" TEXT,
    "petType" TEXT,
    "breed" TEXT,
    "size" TEXT,
    "ageGroup" TEXT,
    "dietaryNeeds" TEXT,
    "temperament" TEXT,
    "color" TEXT,
    "weight" TEXT,
    "vaccinated" BOOLEAN NOT NULL DEFAULT false,
    "neutered" BOOLEAN NOT NULL DEFAULT false,
    "metaobjectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterRule" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "petType" TEXT,
    "breedFilter" TEXT,
    "sizeFilter" TEXT,
    "ageFilter" TEXT,
    "dietFilter" TEXT,
    "temperamentFilter" TEXT,
    "colorFilter" TEXT,
    "weightMin" DOUBLE PRECISION,
    "weightMax" DOUBLE PRECISION,
    "vaccinated" BOOLEAN,
    "neutered" BOOLEAN,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilterRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GdprRequest" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "topic" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "handledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GdprRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPet" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "petType" TEXT NOT NULL,
    "breed" TEXT,
    "age" TEXT,
    "weight" TEXT,
    "color" TEXT,
    "vaccinated" BOOLEAN NOT NULL DEFAULT false,
    "neutered" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerPet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAgreement" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "agreedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_shop_idx" ON "Session"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_shop_key" ON "ShopSettings"("shop");

-- CreateIndex
CREATE INDEX "ShopSettings_shop_idx" ON "ShopSettings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "PetProfile_productId_key" ON "PetProfile"("productId");

-- CreateIndex
CREATE INDEX "PetProfile_shop_idx" ON "PetProfile"("shop");

-- CreateIndex
CREATE INDEX "PetProfile_petType_idx" ON "PetProfile"("petType");

-- CreateIndex
CREATE INDEX "PetProfile_shop_petType_idx" ON "PetProfile"("shop", "petType");

-- CreateIndex
CREATE INDEX "FilterRule_shop_idx" ON "FilterRule"("shop");

-- CreateIndex
CREATE INDEX "FilterRule_shop_isActive_idx" ON "FilterRule"("shop", "isActive");

-- CreateIndex
CREATE INDEX "GdprRequest_shop_idx" ON "GdprRequest"("shop");

-- CreateIndex
CREATE INDEX "GdprRequest_topic_idx" ON "GdprRequest"("topic");

-- CreateIndex
CREATE INDEX "CustomerPet_shop_customerId_idx" ON "CustomerPet"("shop", "customerId");

-- CreateIndex
CREATE INDEX "CustomerPet_shop_customerId_isActive_idx" ON "CustomerPet"("shop", "customerId", "isActive");

-- CreateIndex
CREATE INDEX "CustomerAgreement_shop_idx" ON "CustomerAgreement"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAgreement_shop_customerId_key" ON "CustomerAgreement"("shop", "customerId");
