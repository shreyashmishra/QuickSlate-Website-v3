export const portalModules = [
  {
    title: "Upload Images",
    status: "Live",
    description:
      "Upload images directly to storage from the dashboard.",
  },
  {
    title: "Manage Images",
    status: "Live",
    description:
      "Edit titles, captions, visibility, and display order. Soft or permanently delete images when needed.",
  },
  {
    title: "Carousel Feed",
    status: "Live",
    description:
      "Active images are automatically available to the Website A carousel.",
  },
] as const;

export const roleDescriptions = {
  admin: "Full access to upload, edit, and delete images.",
  uploader: "Can upload images and remove their own uploads.",
} as const;
