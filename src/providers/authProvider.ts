import { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  login: async ({ email, role, name, redirectPath }) => {
    localStorage.setItem("auth", JSON.stringify({ email, role, name }));

    const defaultPath = role === "admin" ? "/dashboard" : "/dashboard";
    
    return {
      success: true,
      redirectTo: redirectPath || defaultPath,
    };
  },
  
  logout: async () => {
    localStorage.removeItem("auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  
  check: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
      error: {
        message: "Check failed",
        name: "Unauthorized",
      },
    };
  },
  
  getPermissions: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth);
      return user.role;
    }
    return null;
  },
  
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth);
      return {
        ...user,
        avatar: user.avatar || undefined,
      };
    }
    return null;
  },
  
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
