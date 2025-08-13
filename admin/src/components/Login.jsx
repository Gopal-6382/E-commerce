import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../config.js";
import { toast } from "react-toastify";
const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    try {
      // console.log("Backend URL:", backendUrl); // Debug

      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/users/admin/login", {
        email,
        password,
      });
      if (response.data.token) {
        setToken(response.data.token);
         localStorage.setItem("token", response.data.token); // Also store in localStorag
      } else {
        toast.error(response.data.message);
      }
      // console.log("Backend URL:", backendUrl); // Debug

      // console.log(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className=" bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none "
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none "
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="mt-2 w-full py-2 px-4 bg-black text-white rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
