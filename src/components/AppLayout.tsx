"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <div className="app-scroll">
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}


