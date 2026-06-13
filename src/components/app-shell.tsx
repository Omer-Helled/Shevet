"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMenu2,
  IconX,
  IconBell,
  IconSearch,
  IconPlus,
  IconMapPin,
  IconStar,
  IconRosetteDiscountCheck,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { mainNav, toolNav, drawerGroups, type NavItem } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/app/login/actions";

const cx = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

function rowClass(active: boolean) {
  return cx(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
    active
      ? "bg-brand-soft text-brand-ink"
      : "text-foreground hover:bg-brand-soft/60",
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClick} className={rowClass(active)}>
      <Icon size={20} stroke={1.75} className="shrink-0 text-brand" />
      <span>{item.label}</span>
    </Link>
  );
}

function NavButton({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <button type="button" className={rowClass(false)}>
      <Icon size={20} stroke={1.75} className="shrink-0 text-brand" />
      <span>{item.label}</span>
    </button>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-strong text-white">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 18 13 6 13Z" />
          <path d="M12 21 6 11 18 11Z" />
        </svg>
      </span>
      <span className="text-base font-medium">Shevet</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar — sits on the right under dir="rtl" */}
      <aside className="hidden w-60 shrink-0 flex-col border-l bg-surface md:flex">
        <div className="px-4 py-4">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>
          <div className="my-3 border-t" />
          <p className="px-3 pb-1 text-xs text-accent">כלים</p>
          <div className="flex flex-col gap-0.5">
            {toolNav.map((item) => (
              <NavButton key={item.href} item={item} />
            ))}
          </div>
        </nav>
        <Link
          href="/profile"
          className="m-3 flex items-center gap-2.5 rounded-lg border p-2.5"
        >
          <span className="grid size-8 place-items-center rounded-full bg-accent text-sm text-[#2b1b05]">
            דכ
          </span>
          <span className="flex-1 truncate text-sm">דוד כהן</span>
          <IconSettings size={18} stroke={1.75} className="text-muted" />
        </Link>
      </aside>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-surface px-4 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="פתח תפריט"
            className="grid size-9 place-items-center rounded-lg hover:bg-brand-soft md:hidden"
          >
            <IconMenu2 size={22} stroke={1.75} />
          </button>
          <span className="flex items-center gap-1 text-sm md:hidden">
            <IconMapPin size={16} stroke={1.75} className="text-brand" />
            תל אביב
          </span>
          <div className="hidden flex-1 items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted sm:flex">
            <IconSearch size={16} stroke={1.75} />
            <span>חפש יעד, קהילה או הזדמנות</span>
          </div>
          <div className="flex-1 sm:hidden" />
          <button
            type="button"
            aria-label="התראות"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand"
          >
            <IconBell size={20} stroke={1.75} />
          </button>
          <ThemeToggle />
          <Link
            href="/stay/new"
            className="hidden items-center gap-1.5 rounded-lg bg-brand-strong px-3.5 py-2 text-sm text-white sm:inline-flex"
          >
            <IconPlus size={16} stroke={2} />
            הוסף נכס
          </Link>
        </header>

        <main className="flex-1 pb-24 md:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t bg-surface md:hidden">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px]"
            >
              <Icon
                size={22}
                stroke={1.75}
                className={active ? "text-brand" : "text-muted"}
              />
              <span className={active ? "text-brand" : "text-muted"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/55"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[82%] flex-col bg-surface">
            <div className="bg-brand-strong px-4 pb-4 pt-3 text-white">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגור תפריט"
                className="mb-2 grid size-8 place-items-center rounded-lg"
              >
                <IconX size={20} stroke={1.75} />
              </button>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <span className="grid size-11 place-items-center rounded-full bg-accent text-base text-[#2b1b05]">
                  דכ
                </span>
                <span>
                  <span className="block text-[15px]">דוד כהן</span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[11px]">
                      <IconRosetteDiscountCheck size={13} stroke={1.75} />
                      מאומת
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs">
                      <IconStar size={13} className="text-accent" /> 4.9
                    </span>
                  </span>
                </span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-2.5 py-2">
              {drawerGroups.map((group) => (
                <div key={group.title} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-xs text-accent">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <NavButton key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-2.5">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  <IconLogout size={20} stroke={1.75} className="shrink-0" />
                  <span>התנתקות</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
