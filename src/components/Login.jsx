import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const USERNAME = "Dolat";
  const PASSWORD = "123456";
  // Language Toggle
  const language = useSelector((state) => state.language.language);
  const isLoggedIn = localStorage.getItem("IsLoggedIn");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let userName = e.target.elements.userName?.value.trim();
    let password = e.target.elements.password?.value.trim();

    if (userName === USERNAME && password === PASSWORD) {
      localStorage.setItem("IsLoggedIn", "true");
      toast.success(
        language === "hi" ? "सफलतापूर्वक लॉगिन हुआ ✅" : "Login Successfully ✅"
      );
      navigate("/dashboard");
    } else {
      toast.error(language === "hi" ? "लॉगिन विफल ❌" : "Login Failed ❌");
    }
    e.target.reset();
  };

  return (
    <div className="h-[90.7vh]  flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md mx-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg border border-gray-200 shadow-lg p-10">
        <h1 className="text-3xl font-semibold text-black text-left leading-10 mb-6">
          {language === "hi"
            ? "अपने खाते में लॉगिन करें 🔐"
            : "Log in to your account 🔐"}
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-black font-medium">
              {language === "hi" ? "यूज़र नाम" : "Username"}
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-400"
              id="userName"
              placeholder={
                language === "hi" ? "आपका यूज़र नाम" : "Your Username"
              }
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-black font-medium">
              {language === "hi" ? "पासवर्ड" : "Password"}
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-400"
              id="password"
              placeholder={language === "hi" ? "आपका पासवर्ड" : "Your Password"}
              required
            />
          </div>

          <div className="flex justify-center items-center mt-6">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md text-lg font-medium transition-transform transform hover:scale-105 focus:outline-none">
              {language === "hi" ? "लॉगिन करें" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
