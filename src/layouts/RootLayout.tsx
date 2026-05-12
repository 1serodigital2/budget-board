import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";

const RootLayout = () => {
  return (
    <div className="flex">
      <SideBarNavigation />
      <main className="w-full">
        <Header />
        <div className="px-10 py-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
