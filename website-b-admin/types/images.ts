import type { ApiResponse } from "@/lib/api/http";
import type { PortalRole } from "@/types/auth";

export type ImageListFilter = "active" | "deleted";

export type DashboardImage = {
  altText: string | null;
  caption: string | null;
  createdAt: string;
  deletedAt: string | null;
  displayOrder: number;
  id: string;
  isVisible: boolean;
  permissions: {
    canEditMetadata: boolean;
    canEditVisibility: boolean;
    canPermanentDelete: boolean;
    canSoftDelete: boolean;
  };
  publicUrl: string;
  storagePath: string;
  title: string | null;
  updatedAt: string;
  uploadedByEmail: string;
  uploadedByUserId: number;
};

export type ImageCounts = {
  active: number;
  deleted: number;
};

export type ImageListPayload = {
  counts: ImageCounts;
  currentUserRole: PortalRole;
  filter: ImageListFilter;
  images: DashboardImage[];
  maxUploadBytes: number;
  storageBucket: string;
};

export type ImageMutationPayload = {
  image: DashboardImage;
  message: string;
};

export type ImageDeletePayload = {
  id: string;
  message: string;
};

export type ImageListResponse = ApiResponse<ImageListPayload>;
export type ImageMutationResponse = ApiResponse<ImageMutationPayload>;
export type ImageDeleteResponse = ApiResponse<ImageDeletePayload>;
