import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return <h1>Dashboard</h1>;
};

export default Dashboard;
