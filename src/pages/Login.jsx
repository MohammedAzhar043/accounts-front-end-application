import LoginForm from "../components/login/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const { username, setUsername, password, setPassword, handleSubmit, loading } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12 relative">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <FaSpinner className="text-indigo-600 text-7xl animate-spin" />
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative z-10">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
