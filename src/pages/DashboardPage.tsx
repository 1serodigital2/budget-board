import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  console.log("auth", currentUser);

  return <h1>Dashboard</h1>;
};

export default Dashboard;
