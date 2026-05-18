import type { Metadata } from "next";
import { IndustrialDeck } from "@/components/IndustrialDeck";

export const metadata: Metadata = {
  title: "Industrial Design",
  description:
    "Industrial design work by Ryan Zhang — consumer products, Red Dot and international design recognition.",
};

export default function IndustrialDesignPage() {
  return <IndustrialDeck />;
}
