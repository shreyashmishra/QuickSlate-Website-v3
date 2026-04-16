CREATE TYPE "portal_role" AS ENUM ('uploader', 'admin');

CREATE TABLE "allowed_users" (
  "id" BIGSERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "role" "portal_role" NOT NULL DEFAULT 'uploader',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "allowed_users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "allowed_users_email_lowercase_check" CHECK ("email" = LOWER("email"))
);

CREATE UNIQUE INDEX "allowed_users_email_key" ON "allowed_users"("email");

INSERT INTO "allowed_users" ("email", "role", "is_active")
VALUES ('shreyashmishra2016@gmail.com', 'admin', true)
ON CONFLICT ("email") DO UPDATE
SET
  "role" = EXCLUDED."role",
  "is_active" = EXCLUDED."is_active",
  "updated_at" = CURRENT_TIMESTAMP;
