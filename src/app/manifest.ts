import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shevet — קהילה יהודית עולמית",
    short_name: "Shevet",
    description:
      "הפלטפורמה שמחברת יהודים בכל העולם: לינה, התנדבות וגילוי קהילות.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ec",
    theme_color: "#234e70",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
