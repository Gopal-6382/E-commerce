import { useContext, useEffect, useState } from "react";
import { backendUrl } from "../../config";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login"); // "Login" or "Sign Up"
  const { setToken, navigate } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;

      if (currentState === "Sign Up") {
        res = await axios.post(`${backendUrl}/api/users/signup`, {
          name,
          email,
          password,
        });
      } else if (currentState === "Login") {
        res = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });
      } else {
        toast.error("Please select Login or Sign Up first");
        return;
      }

      // console.log("📦 Full Server Response:", res.data);
      // console.log("Login attempt for:", email);

      if (res.data.success) {
        toast.success(res.data.message || "Success");

        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          navigate("/");
        }
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      if (err.response) {
        console.error("❌ Error Response:", err.response.data);
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        console.error("🌐 Network Error:", err);
        toast.error("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/");
  }
}, []);
  return (
    <form
      onSubmit={OnSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[2.5px] w-8 bg-gray-800" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {currentState === "Sign Up" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          className="border w-full px-3 py-2 border-gray-800"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="border w-full px-3 py-2 border-gray-800"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        className="border w-full px-3 py-2 border-gray-800"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-gray-800 text-white px-4 py-2 w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : currentState}
      </button>
    </form>
  );
};

export default Login;
