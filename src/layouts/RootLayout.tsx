import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";

const RootLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(window.innerWidth > 768);

  const handleSidebarToggle = () => {
    setSidebarActive((prevState) => !prevState);
  };

  return (
    <div className="flex max-w-[100vw] overflow-hidden">
      <SideBarNavigation sidebarActive={sidebarActive} />
      <main className="w-full relative">
        <Header handleSidebarToggle={handleSidebarToggle} />
        <div className="px-3 py-5 md:px-6 bg-(--color-background)">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
