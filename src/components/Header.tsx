import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logOut } = useAuth();
  console.log("user id", user.uid);
  console.log("user", user);

  return (
    <div className="flex justify-between px-10 py-5 border-b">
      <h1>Header</h1>
      <button onClick={() => logOut()} className="cursor-pointer">
        Logout
      </button>
    </div>
  );
};

export default Header;
