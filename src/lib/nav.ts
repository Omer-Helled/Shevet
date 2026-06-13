import {
  IconCompass,
  IconBed,
  IconLayoutGrid,
  IconMessage2,
  IconUser,
  IconBuildingStore,
  IconArrowsExchange2,
  IconBookmark,
  IconCalendarEvent,
  IconMapPin,
  IconUsersGroup,
  IconLanguage,
  IconUserPlus,
  IconSettings,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

type IconType = ComponentType<{
  size?: number;
  stroke?: number;
  className?: string;
}>;

export type NavItem = { href: string; label: string; icon: IconType };
export type NavGroup = { title: string; items: NavItem[] };

// The five primary destinations — bottom nav on mobile, top of the sidebar on desktop.
export const mainNav: NavItem[] = [
  { href: "/", label: "גלה", icon: IconCompass },
  { href: "/stay", label: "לינה", icon: IconBed },
  { href: "/board", label: "לוח", icon: IconLayoutGrid },
  { href: "/messages", label: "הודעות", icon: IconMessage2 },
  { href: "/profile", label: "פרופיל", icon: IconUser },
];

// Cross-cutting tools — shown under "כלים" in both the desktop sidebar and the mobile drawer.
export const toolNav: NavItem[] = [
  { href: "/calendar", label: "לוח שנה וזמני שבת", icon: IconCalendarEvent },
  { href: "/map", label: "מפת מוקדים יהודיים", icon: IconMapPin },
  { href: "/communities", label: "הקהילות שלי", icon: IconUsersGroup },
];

// The full drawer (and desktop sidebar) groups for everything that is not a primary tab.
export const drawerGroups: NavGroup[] = [
  {
    title: "הפעילות שלי",
    items: [
      { href: "/me/listings", label: "הנכסים והמודעות שלי", icon: IconBuildingStore },
      { href: "/me/requests", label: "הבקשות שלי", icon: IconArrowsExchange2 },
      { href: "/me/saved", label: "שמורים", icon: IconBookmark },
    ],
  },
  { title: "כלים", items: toolNav },
  {
    title: "כללי",
    items: [
      { href: "/settings/language", label: "שפה: עברית", icon: IconLanguage },
      { href: "/invite", label: "הזמן חברים", icon: IconUserPlus },
      { href: "/settings", label: "הגדרות", icon: IconSettings },
    ],
  },
];
