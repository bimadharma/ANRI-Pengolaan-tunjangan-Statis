import { AuthProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "http://localhost:3001";
const EXPIRATION_DURATION = 60 * 60 * 1000; // 1 Jam

export const authProvider: AuthProvider = {
  // 1. LOGIN
  login: async ({ username, password }) => {
    try {
      const response = await axios.get(`${API_URL}/users?username=${username}&password=${password}`);
      const user = response.data[0];

      if (!user) {
        throw {
          name: "LoginError",
          message: "Username atau password salah",
        };
      }

      // Jika user ditemukan → simpan token
      const now = new Date();
      const item = {
        value: user,
        expiry: now.getTime() + EXPIRATION_DURATION,
      };
      localStorage.setItem("auth", JSON.stringify(item));

      const to = user.role === "admin" ? "/admin" : "/user";

      return {
        success: true,
        redirectTo: to,
      };
    } catch (error) {

      throw error;
    }
  },

  // 2. LOGOUT
  logout: async () => {
    // Hapus data auth
    localStorage.removeItem("auth");

    // Return sukses dan paksa redirect ke login
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // 3. CHECK (Validasi Sesi)
  check: async () => {
    const dataStr = localStorage.getItem("auth");

    if (!dataStr) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      const item = JSON.parse(dataStr);
      const now = new Date();

      // Cek kadaluarsa token
      if (now.getTime() > item.expiry) {
        localStorage.removeItem("auth");
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            message: "Sesi telah habis, silakan login kembali.",
            name: "SessionExpired",
          },
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      // Jika JSON error/corrupt
      localStorage.removeItem("auth");
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  // 4. GET PERMISSIONS (Penting untuk Guard di App.tsx)
  getPermissions: async () => {
    const dataStr = localStorage.getItem("auth");
    if (dataStr) {
      const item = JSON.parse(dataStr);
      return item.value.role; // Mengembalikan string 'admin' atau 'user'
    }
    return null;
  },

  // 5. GET IDENTITY
  getIdentity: async () => {
    const dataStr = localStorage.getItem("auth");
    if (dataStr) {
      const item = JSON.parse(dataStr);
      return item.value;
    }
    return null;
  },

  // 6. ON ERROR
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }
    return {};
  },
};
