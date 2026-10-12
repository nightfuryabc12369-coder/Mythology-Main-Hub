import { AccountSync } from "@/components/archive/account-sync";
import { Footer } from "@/components/archive/footer";
import { Navbar, ScrollProgress } from "@/components/archive/navbar";
import { CouncilModal, DetailSheet, Dossier, SearchOverlay } from "@/components/archive/overlays";
import { useArchiveStore } from "@/lib/archive-store";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const overlay = useArchiveStore((state) => state.overlay);
  const searchOpen = useArchiveStore((state) => state.searchOpen);
  const councilOpen = useArchiveStore((state) => state.councilOpen);
  const closeOverlay = useArchiveStore((state) => state.closeOverlay);
  const setSearchOpen = useArchiveStore((state) => state.setSearchOpen);
  const setCouncilOpen = useArchiveStore((state) => state.setCouncilOpen);

  useEffect(() => {
    void Promise.resolve(useArchiveStore.persist.rehydrate()).then(() => {
      useArchiveStore.setState({ hydrated: true, councilOpen: false });
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const locked = Boolean(overlay) || searchOpen || councilOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay, searchOpen, councilOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else if (councilOpen) setCouncilOpen(false);
        else if (overlay) closeOverlay();
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, searchOpen, councilOpen, closeOverlay, setSearchOpen, setCouncilOpen]);

  return (
    <div className="ink-grid min-h-screen bg-bg text-fg">
      <ScrollProgress />
      <AccountSync />
      <Navbar />
      <div key={pathname} className="page-enter pt-16">
        <Outlet />
      </div>
      <Footer />
      <SearchOverlay />
      <Dossier />
      <DetailSheet />
      <CouncilModal />
    </div>
  );
}
