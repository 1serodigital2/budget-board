import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logOut } = useAuth();
  console.log("user", user);

  return (
    <>
      <h1>Header</h1>
      <button onClick={() => logOut()}>Logout</button>
    </>
  );
};

export default Header;
