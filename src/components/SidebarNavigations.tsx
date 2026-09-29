import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PropsType {
  sidebarActive: boolean;
  handleSidebarToggle: () => void;
  isDesktop: boolean;
}

const SideBarNavigation = ({
  sidebarActive,
  handleSidebarToggle,
  isDesktop,
}: PropsType) => {
  const { logOut, user } = useAuth();
  
  const sidebarToggler = () => {
    if (!isDesktop) {
      handleSidebarToggle();
    }
  };

  const NavItem = ({ to, icon, label, exact = false, onClick }: any) => (
    <li className="mb-1.5 px-3">
      <NavLink
        to={to}
        end={exact}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground font-medium"
          }`
        }
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'wght' 300", fontSize: 20 }}
        >
          {icon}
        </span>
        <span className="text-[13.5px] tracking-wide">{label}</span>
      </NavLink>
    </li>
  );

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed md:relative z-30 transition-all duration-300 ease-in-out ${
        sidebarActive ? "w-[240px] translate-x-0" : "-translate-x-full md:w-[80px] md:translate-x-0"
      }`}
    >
      <div className="flex items-center gap-3 h-20 px-6 mt-2 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'wght' 600" }}>currency_rupee</span>
        </div>
        <div className={`transition-opacity duration-300 ${sidebarActive ? "opacity-100" : "md:opacity-0 hidden md:block"}`}>
          <h2 className="font-bold text-[16px] text-foreground tracking-tight leading-tight">Budget Board</h2>
          <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">Wealth Ops</div>
        </div>
        {!isDesktop && (
          <button onClick={handleSidebarToggle} className="ml-auto text-muted-foreground hover:text-foreground">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar mt-2">
        <ul className="flex flex-col">
          <NavItem to="/" icon="dashboard" label="Dashboard" exact={true} onClick={sidebarToggler} />
          <NavItem to="/expenses" icon="receipt_long" label="Expenses" exact={false} onClick={sidebarToggler} />
          <NavItem to="/categories" icon="category" label="Categories" exact={false} onClick={sidebarToggler} />
          <NavItem to="/budget" icon="account_balance_wallet" label="Budget" exact={false} onClick={sidebarToggler} />
          <NavItem to="/reports" icon="bar_chart" label="Reports" exact={false} onClick={sidebarToggler} />
          <NavItem to="/settings" icon="settings" label="Settings" exact={false} onClick={sidebarToggler} />
        </ul>
      </div>

      <div className="p-4 mt-auto border-t border-sidebar-border/50">
        <div className="flex items-center gap-3 w-full">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${sidebarActive ? "opacity-100" : "md:opacity-0 hidden md:block"}`}>
            <div className="text-[13px] font-semibold text-foreground truncate">{user?.email?.split('@')[0] || 'User'}</div>
            <div className="text-[10px] text-primary font-bold tracking-widest uppercase">Executive</div>
          </div>
          <button onClick={logOut} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 rounded-md hover:bg-white/5" title="Logout">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBarNavigation;
