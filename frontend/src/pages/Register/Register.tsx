import { useState } from "react";
import Input from "../../components/Input/Input";
import Alert from "../../components/Alert/Alert";
import { CustomError } from "../../common/reponse";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { register } from "./service";
import { RegisterResponse } from "./interface";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman

    try {
      const data: RegisterResponse = await register({
        email,
        username,
        password,
        name,
      });

      if (data.token && data.result?.username) {
        login(data.token, data.result?.username, data.result.root_id);
      }

      Alert({
        title: "Success!",
        icon: "success",
        text: "Registration successful",
        onConfirm: () => navigate("/"), // Navigasi ke halaman login setelah pendaftaran berhasil
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
        <h1 className="text-center font-bold text-[24px] mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
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
            Register
          </button>
        </form>
        <p className="text-center text-[12px] pt-2">
          Apakah sudah memiliki akun?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Iya
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
