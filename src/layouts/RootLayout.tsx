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
    <div className="flex max-w-[100vw] overflow-hidden">
      <SideBarNavigation
        sidebarActive={sidebarActive}
        handleSidebarToggle={handleSidebarToggle}
        isDesktop={isDesktop}
      />
      <main className="w-full relative">
        <Header handleSidebarToggle={handleSidebarToggle} />
        <div className="px-3 py-5 md:px-6 bg-(--color-background)">
          {!isDesktop && (
            <div
              className={`absolute inset-0 bg-[rgba(0,0,0,0.8)] transition-all duration-200 z-10 ${sidebarActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              onClick={() => !isDesktop && setSidebarActive(false)}
            ></div>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
