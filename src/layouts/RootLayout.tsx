import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";

const RootLayout = () => {
  const isDesktop = window.innerWidth > 768;
  const [sidebarActive, setSidebarActive] = useState(isDesktop);

  const handleSidebarToggle = () => {
    setSidebarActive((prevState) => !prevState);
  };

  return (
    <div className="flex max-w-[100vw] min-h-screen overflow-hidden text-foreground">
      <SideBarNavigation
        sidebarActive={sidebarActive}
        handleSidebarToggle={handleSidebarToggle}
        isDesktop={isDesktop}
      />
      <main className="flex-1 relative flex flex-col transition-all duration-300">
        <Header handleSidebarToggle={handleSidebarToggle} />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!isDesktop && (
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 z-10 ${sidebarActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              onClick={() => !isDesktop && setSidebarActive(false)}
            ></div>
          )}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
