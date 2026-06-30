import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";

const RootLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarActive((prevState) => !prevState);
  };

  return (
    <div className="flex">
      <SideBarNavigation sidebarActive={sidebarActive} />
      <main className="w-full">
        <Header handleSidebarToggle={handleSidebarToggle} />
        <div className="px-6 py-5 bg-(--color-background)">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
