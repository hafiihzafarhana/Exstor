import { useState } from "react";
import Input from "../../components/Input/Input";
import { login as AxiosLogin } from "./service";
import Alert from "../../components/Alert/Alert";
import { CustomError } from "../../common/reponse";
import axios from "axios";
import { LoginResponse } from "./interface";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman

    try {
      const data: LoginResponse = await AxiosLogin(email, password);
      if (data.token && data.result?.username) {
        login(data.token, data.result?.username, data.result.root_id);
      }
      Alert({
        title: "Success!",
        icon: "success",
        text: "Login success",
        onConfirm: () => navigate("/"),
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CustomError;

        Alert({
          title: "Error!",
          icon: "error",
          text: errorData.message,
        });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-center font-bold text-[24px] mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="username"
            >
              Email
            </label>

            <Input
              type="email"
              id="email"
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>

            <Input
              type="password"
              id="password"
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </form>
        <p className="text-center text-[12px] pt-2">
          Apakah belum memiliki akun?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Belum
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
