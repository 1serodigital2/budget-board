import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { ButtonLink } from "../ui/Button";
import Icon from "../ui/Icon";
import Brand from "./Brand";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const email = user?.email ?? "";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full p-0.5 pr-1 hover:bg-muted sm:pr-2"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary">
          {email.charAt(0).toUpperCase() || "U"}
        </span>
        <Icon name="expand_more" size={18} className="hidden text-muted-foreground sm:inline-block" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-card shadow-xl animate-in fade-in zoom-in-95"
        >
          <div className="border-b px-4 py-3">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate text-sm font-medium text-foreground">{email}</p>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Icon name="logout" size={18} className="text-muted-foreground" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="-ml-1.5 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
      <Link to="/" className="lg:hidden" aria-label="Budget Board home">
        <Brand compact />
      </Link>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Light theme" : "Dark theme"}
        >
          <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} />
        </button>
        {/* Icon-only on phones; the label appears from the sm breakpoint. */}
        <ButtonLink
          to="/expenses/new"
          icon="add"
          size="sm"
          className="max-sm:w-8 max-sm:px-0"
          aria-label="Add expense"
        >
          <span className="hidden sm:inline">Add expense</span>
        </ButtonLink>
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
