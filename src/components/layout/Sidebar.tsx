import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Brand from "./Brand";
import Icon from "../ui/Icon";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "space_dashboard", end: true },
  { to: "/expenses", label: "Expenses", icon: "receipt_long", end: false },
  { to: "/budgets", label: "Budgets", icon: "savings", end: false },
  { to: "/categories", label: "Categories", icon: "sell", end: false },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" onClick={onClose} aria-label="Budget Board home">
            <Brand />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-subtle uppercase">
            Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={item.icon} filled={isActive} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="m-3 rounded-xl border bg-muted/60 p-4">
          <p className="text-[13px] font-semibold text-foreground">Plan next month</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Copy this month's budgets forward in one click.
          </p>
          <Link
            to="/budgets"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Go to budgets
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
