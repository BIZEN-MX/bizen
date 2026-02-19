"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  brandName: string;
  brandEmoji?: string;
  logoImage?: string;
  navSobreLabel: string; navSobreUrl: string;
  navCursosLabel: string; navCursosUrl: string;
  navPreciosLabel: string; navPreciosUrl: string;
  navFaqLabel: string; navFaqUrl: string;
  navContactoLabel: string; navContactoUrl: string;
  loginLabel: string; loginUrl: string;
  signupLabel: string; signupUrl: string;
};

export default function Header({
  brandName, brandEmoji = "", logoImage,
  navSobreLabel, navSobreUrl,
  navCursosLabel, navCursosUrl,
  navPreciosLabel, navPreciosUrl,
  navFaqLabel, navFaqUrl,
  navContactoLabel, navContactoUrl,
  loginLabel, loginUrl,
  signupLabel, signupUrl,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const firstFocusable = React.useRef<HTMLAnchorElement>(null);
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  // 🔒 Body scroll lock
  React.useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  // Cerrar con ESC
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Trap de foco simple cuando está abierto
  React.useEffect(() => {
    if (!open) return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button');
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last as HTMLElement)?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first as HTMLElement)?.focus();
      }
    }
    document.addEventListener("keydown", trap);
    (first as HTMLElement | undefined)?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label={`${brandName} inicio`}>
          {logoImage ? (
            <img
              src={logoImage}
              alt={`${brandName} Logo`}
              className="logo-image"
              width={36}
              height={36}
            />
          ) : (
            <div className="logo" aria-hidden="true">{brandEmoji}</div>
          )}
          <span className="brand-text">{brandName}</span>
        </a>

        {/* Nav desktop */}
        <nav className="nav">
          <a href={navSobreUrl}>{navSobreLabel}</a>
          <a href={navCursosUrl}>{navCursosLabel}</a>
          <a href={navPreciosUrl}>{navPreciosLabel}</a>
          <a href={navFaqUrl}>{navFaqLabel}</a>
          <a href={navContactoUrl}>{navContactoLabel}</a>

        </nav>

        <div className="header-ctas">
          {user ? (
            // Authenticated user - show logout only
            <button
              className="btn primary"
              onClick={async () => {
                if (loggingOut) return
                setLoggingOut(true)
                try {
                  await signOut()
                  // Redirect to landing page
                  window.location.href = '/'
                } catch (error) {
                  console.error('Logout error:', error)
                  setLoggingOut(false)
                }
              }}
              disabled={loggingOut}
            >
              {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          ) : (
            // Not authenticated - show login/signup
            <>
              <a className="btn ghost" href={loginUrl} target="_blank" rel="noopener noreferrer">{loginLabel}</a>
              <a className="btn primary" href={signupUrl} target="_blank" rel="noopener noreferrer">{signupLabel}</a>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo visible en móvil por CSS) */}
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          type="button"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={`mobile-nav ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <div className="mobile-nav__panel card" ref={panelRef}>
          <a ref={firstFocusable} href={navSobreUrl} onClick={() => setOpen(false)}>{navSobreLabel}</a>
          <a href={navCursosUrl} onClick={() => setOpen(false)}>{navCursosLabel}</a>
          <a href={navPreciosUrl} onClick={() => setOpen(false)}>{navPreciosLabel}</a>
          <a href={navFaqUrl} onClick={() => setOpen(false)}>{navFaqLabel}</a>
          <a href={navContactoUrl} onClick={() => setOpen(false)}>{navContactoLabel}</a>

          <div className="mobile-nav__ctas">
            {user ? (
              // Authenticated user - show logout only
              <button
                className="btn primary"
                onClick={async () => {
                  if (loggingOut) return
                  setLoggingOut(true)
                  setOpen(false)
                  try {
                    await signOut()
                    window.location.href = '/'
                  } catch (error) {
                    console.error('Logout error:', error)
                    setLoggingOut(false)
                  }
                }}
                disabled={loggingOut}
              >
                {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            ) : (
              // Not authenticated - show login/signup
              <>
                <a className="btn ghost" href={loginUrl} onClick={() => setOpen(false)}>{loginLabel}</a>
                <a className="btn primary" href={signupUrl} onClick={() => setOpen(false)}>{signupLabel}</a>
              </>
            )}
          </div>
          <button className="btn ghost" onClick={() => setOpen(false)} type="button">Cerrar</button>
        </div>
        <button
          className="mobile-nav__backdrop"
          aria-label="Cerrar menú"
          aria-hidden={!open}
          onClick={() => setOpen(false)}
        />
      </div>
    </header>
  );
}
