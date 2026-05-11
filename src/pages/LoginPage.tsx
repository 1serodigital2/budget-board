import Input from "../components/Input";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="mb-20">Login</h1>
      <div className="bg-[#7c3aed] p-3 rounded">
        <form action="">
          <div className="mb-2.5">
            <Input name="email" label="Email" required />
            <Input name="password" label="Password" required />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
