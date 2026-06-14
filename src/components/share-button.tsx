"use client";

import { useState } from "react";
import { IconShare, IconCheck } from "@tabler/icons-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
    >
      {copied ? <IconCheck size={19} stroke={1.75} /> : <IconShare size={19} stroke={1.75} />}
      {copied ? "הקישור הועתק" : "שתף"}
    </button>
  );
}
