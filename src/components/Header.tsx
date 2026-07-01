import { useAuth } from "../context/AuthContext";

interface HeaderTypes {
  handleSidebarToggle: () => void;
}

const Header = ({ handleSidebarToggle }: HeaderTypes) => {
  const { logOut } = useAuth();
  return (
    <div className="flex border-b h-15 items-center sticky top-0">
      <div
        className="pl-2 md:pl-5 pr-2 md:pr-4 border-r flex cursor-pointer"
        onClick={() => handleSidebarToggle()}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'wght' 300", fontSize: 23 }}
        >
          dock_to_right
        </span>
      </div>
      <div className="flex justify-between w-full pl-3 md:pl-4 pr-2 md:pr-5 items-center">
        <div>
          <h5 className="font-medium text-[.9rem]">Dashboard</h5>
          <div className="text-[.7rem]">Budget summary & insight</div>
        </div>
        <button
          onClick={() => logOut()}
          className="cursor-pointer flex items-center gap-1"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'wght' 300", fontSize: 20 }}
          >
            logout
          </span>
          <span className="text-[.8rem] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
