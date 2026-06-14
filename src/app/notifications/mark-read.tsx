"use client";

import { useEffect } from "react";
import { markAllRead } from "./actions";

// Marks notifications as read when the page opens (clears the bell badge).
export function MarkRead() {
  useEffect(() => {
    markAllRead();
  }, []);
  return null;
}
