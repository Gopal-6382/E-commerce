import { useState } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

  const OnSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`${currentState} form submitted`);
    // Add API call or validation here
  };

  return (
    <form
      onSubmit={OnSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[2.5px] w-8 bg-gray-800" />
      </div>

      {currentState !== "Login" && (
        <input
          type="text"
          placeholder="Name"
          className="border w-full px-3 py-2 border-gray-800"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        className="border w-full px-3 py-2 border-gray-800"
        required
      />
      <input
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
      >
        {currentState}
      </button>
    </form>
  );
};

export default Login;
