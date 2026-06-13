import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shevet — קהילה יהודית עולמית",
    short_name: "Shevet",
    description:
      "הפלטפורמה שמחברת יהודים בכל העולם: לינה, התנדבות וגילוי קהילות.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe2",
    theme_color: "#1e6f9f",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
