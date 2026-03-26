import type { Metadata } from "next";
import PhotoGallery from "@/components/photography/PhotoGallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Film photography and Ricoh GR3x HDF shots by Wei-Cheng Chen. Negative film, street photography, and quiet moments.",
};

export default function PhotographyPage() {
  return <PhotoGallery />;
}
