"use client";

import { useSyncExternalStore } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

// Subscribe to changes of the `dark` class on <html> so the icon stays in sync.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "עבור למצב יום" : "עבור למצב לילה"}
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-soft hover:text-brand"
    >
      {dark ? (
        <IconSun size={20} stroke={1.75} />
      ) : (
        <IconMoon size={20} stroke={1.75} />
      )}
    </button>
  );
}
