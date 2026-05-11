import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";

const RootLayout = () => {
  return (
    <div className="flex">
      <SideBarNavigation />
      <main>
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
