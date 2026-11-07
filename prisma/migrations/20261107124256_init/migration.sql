-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "steamId64" TEXT NOT NULL,
    "personaName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "profileUrl" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "searchable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId64_key" ON "User"("steamId64");
