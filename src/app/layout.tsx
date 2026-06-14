import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getProfile } from "@/lib/auth";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shevet — קהילה יהודית עולמית",
  description:
    "הפלטפורמה שמחברת יהודים בכל העולם: חילופי בתים ואירוח, התנדבות ועבודה, וגילוי קהילות ומוקדים יהודיים.",
  applicationName: "Shevet",
  appleWebApp: { capable: true, title: "Shevet", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#234e70" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1825" },
  ],
};

const noFlashTheme = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();
  const name = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const user = profile
    ? {
        name: name || "משתמש",
        verified: Boolean(profile.is_verified),
        avatarUrl: profile.avatar_url,
      }
    : null;

  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
