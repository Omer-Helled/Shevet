"use client";

import { useActionState, useState } from "react";
import { authenticate, type AuthState } from "./actions";

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand";

export function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="mode" value={mode} />

      {mode === "up" && (
        <div className="grid grid-cols-2 gap-3">
          <input
            name="first_name"
            placeholder="שם פרטי"
            autoComplete="given-name"
            className={inputCls}
          />
          <input
            name="last_name"
            placeholder="שם משפחה"
            autoComplete="family-name"
            className={inputCls}
          />
        </div>
      )}

      <input
        name="email"
        type="email"
        placeholder="אימייל"
        autoComplete="email"
        required
        className={inputCls}
      />
      <input
        name="password"
        type="password"
        placeholder="סיסמה"
        autoComplete={mode === "up" ? "new-password" : "current-password"}
        required
        className={inputCls}
      />

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state?.notice && (
        <p className="text-sm text-brand-ink">{state.notice}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-brand-strong px-4 py-2.5 text-sm text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "רגע..." : mode === "in" ? "התחברות" : "הרשמה"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="text-center text-xs text-muted transition-colors hover:text-brand"
      >
        {mode === "in" ? "אין לך חשבון? להרשמה" : "כבר רשום? להתחברות"}
      </button>
    </form>
  );
}
