-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "user_type" INTEGER NOT NULL,
    "created_on" INTEGER NOT NULL,
    "validated" BOOLEAN NOT NULL,
    "validated_on" INTEGER NOT NULL,
    "validation_method" INTEGER NOT NULL,
    "validation_value" TEXT NOT NULL,
    "progress_lesson" INTEGER NOT NULL,
    "progress_content" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auth_key" TEXT NOT NULL,
    "changed_on" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
