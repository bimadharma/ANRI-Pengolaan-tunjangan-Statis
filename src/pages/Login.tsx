import { useState } from "react";
import api from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showError("Username dan password wajib diisi!");
      return;
    }

    const { data } = await api.get("/users", {
      params: { username, password },
    });

    if (data.length === 0) {
      showError("Username atau password salah!");
      return;
    }

    const user = data[0];
    login(user);

    if (user.role === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100 p-4 mt-5">

      {/* 🌟 ERROR POPUP */}
      {error && (
        <div className="fixed top-19 right-6 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
          {error}
        </div>
      )}

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-600 font-medium">Username</label>
            <input
              type="text"
              placeholder="Masukkan username..."
              className="border w-full p-3 rounded-lg mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-slate-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="Masukkan password..."
              className="border w-full p-3 rounded-lg mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-600 text-white py-3 rounded-lg mt-2 text-lg
                       hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Masuk
          </button>
          <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-300 hover:bg-gray-400 transition-all text-black py-3 rounded-lg shadow-md"
        >
          Kembali ke Home
        </button>
        </form>
        
      </div>
    </div>
  );
}
