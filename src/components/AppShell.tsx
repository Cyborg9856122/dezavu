import type { ReactNode } from "react";
import { Logo } from "./Logo";

interface AppShellProps {
  mode: "dark" | "light";
  headerRight?: string;
  showHeader?: boolean;
  children: ReactNode;
}

/**
 * Full-bleed screen chrome — this app runs directly on the device's own
 * display (3.1), so no bezel/hardware is simulated here, just the in-UI
 * header (wordmark + contextual label) that actually belongs to the screen.
 */
export function AppShell({ mode, headerRight, showHeader = true, children }: AppShellProps) {
  const bg = mode === "dark" ? "bg-ink" : "bg-white";

  return (
    <div className={`flex h-screen w-screen flex-col overflow-hidden ${bg}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-5 pt-5">
          <Logo variant={mode === "dark" ? "reversed" : "primary"} className="text-[11px]" />
          {headerRight && (
            <span
              className={`text-[11px] font-medium ${mode === "dark" ? "text-cream/50" : "text-clay"}`}
            >
              {headerRight}
            </span>
          )}
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
