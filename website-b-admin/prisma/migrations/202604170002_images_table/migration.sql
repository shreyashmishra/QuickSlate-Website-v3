CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "images" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT,
  "caption" TEXT,
  "alt_text" TEXT,
  "storage_path" TEXT NOT NULL,
  "public_url" TEXT NOT NULL,
  "uploaded_by_email" TEXT NOT NULL,
  "uploaded_by_user_id" BIGINT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),
  "is_visible" BOOLEAN NOT NULL DEFAULT true,
  "display_order" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "images_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "images_display_order_check" CHECK ("display_order" >= 0),
  CONSTRAINT "images_storage_path_nonempty_check" CHECK (char_length("storage_path") > 0),
  CONSTRAINT "images_public_url_nonempty_check" CHECK (char_length("public_url") > 0),
  CONSTRAINT "images_uploaded_by_user_id_fkey"
    FOREIGN KEY ("uploaded_by_user_id")
    REFERENCES "allowed_users"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "images_storage_path_key" ON "images"("storage_path");
CREATE INDEX "images_deleted_at_idx" ON "images"("deleted_at");
CREATE INDEX "images_display_order_created_at_idx" ON "images"("display_order", "created_at" DESC);
CREATE INDEX "images_uploaded_by_email_idx" ON "images"("uploaded_by_email");
CREATE INDEX "images_uploaded_by_user_id_deleted_at_idx" ON "images"("uploaded_by_user_id", "deleted_at");
CREATE INDEX "images_is_visible_display_order_idx" ON "images"("is_visible", "display_order");
