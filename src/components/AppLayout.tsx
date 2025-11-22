import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
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


