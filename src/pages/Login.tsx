import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, X, Lock, User } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const { mutate: login, isPending: isLoading } = useLogin();
  const navigate = useNavigate();

  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field kosong
    if (!username.trim() || !password.trim()) {
      showAlert("error", "Username dan password wajib diisi!");
      return;
    }

    // Proses login
    login(
      { username: username, password: password },
      {
        onError: (err) => {
          showAlert("error", "Username atau password salah!");
          console.error(err);
        },
      }
    );
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center min-h-screen p-4 mt-7">
      {/* Alert Component */}
      {alert.show && (
        <div
          className={`fixed top-6 right-6 max-w-md w-full shadow-2xl rounded-lg p-4 flex items-start gap-3 z-50 animate-slide-in ${
            alert.type === "error"
              ? "bg-red-50 border-l-4 border-red-500"
              : "bg-green-50 border-l-4 border-green-500"
          }`}
        >
          {alert.type === "error" ? (
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          
          <div className="flex-1">
            <h3
              className={`font-semibold mb-1 ${
                alert.type === "error" ? "text-red-800" : "text-green-800"
              }`}
            >
              {alert.type === "error" ? "Error!" : "Berhasil!"}
            </h3>
            <p
              className={`text-sm ${
                alert.type === "error" ? "text-red-700" : "text-green-700"
              }`}
            >
              {alert.message}
            </p>
          </div>

          <button
            onClick={closeAlert}
            className={`p-1 rounded-full transition-colors ${
              alert.type === "error"
                ? "hover:bg-red-100 text-red-500"
                : "hover:bg-green-100 text-green-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Selamat Datang</h1>
          <p className="text-slate-500 mt-2">Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username Field */}
          <div>
            <label className="text-slate-700 font-medium mb-2 block">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Masukkan username..."
                className="border w-full pl-11 pr-4 py-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-slate-700 font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Masukkan password..."
                className="border w-full pl-11 pr-4 py-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg mt-2 text-lg font-semibold transition shadow-md hover:shadow-lg flex justify-center items-center gap-2
              ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5"
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isLoading}
            className="bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 py-3 rounded-lg shadow-sm font-medium"
          >
            Kembali ke Home
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}