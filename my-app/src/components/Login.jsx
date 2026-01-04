import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../components/AuthContext";


let Login = () => {
  let [error, setError] = useState({});
  let navigate = useNavigate();
  let { setUserData } = userAuth();

  let [inValue, setInValue] = useState({ email: "", password: "" });
  let handleChange = (e) => {
    let { name, value } = e.target;
    setInValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = import.meta.env.VITE_API_BASE_URL;
    let err = {};
    if (!inValue.email.trim()) {
      err.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inValue.email)) {
      err.email = "Enter valid email";
    }
    if (!inValue.password.trim()) {
      err.password = "Password is required!";
    }
    setError(err);
    let errorCheck = Object.keys(err);
    if (errorCheck != 0) return;
    try {
      let loginSubmit = await axios.post(`${API}/login`, inValue, {
        withCredentials: true,
      });

      if (loginSubmit.data.success == true) {
        toast.success(loginSubmit.data.message);
        setInValue({ email: "", password: "" });
setUserData(loginSubmit.data.user);
       navigate("/chat", { replace: true });
      } else {
        toast.error(loginSubmit.data.message);
      }
    } catch (error) {
      // console.log(error.response.data.message)
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>

        <form>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              name="email"
              value={inValue.email}
              onChange={handleChange}
            />
            {error.email && (
              <span className="text-red-700 text-sm mt-10">{error.email}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              name="password"
              value={inValue.password}
              onChange={handleChange}
            />
            {error.password && (
              <span className="text-red-700 text-sm mt-10">
                {error.password}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?
          <a href="/form" className="text-blue-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
