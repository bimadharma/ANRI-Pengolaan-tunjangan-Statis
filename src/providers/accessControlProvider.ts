import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return { can: false };
    }

    const user = JSON.parse(auth);
    const userRole = user.role;
    const resourceMeta = params?.resource?.meta;
    const allowedRoles = resourceMeta?.roles;

    
    if (!allowedRoles || allowedRoles.length === 0) {
      return { can: true };
    }

    
    const canAccess = allowedRoles.includes(userRole);

    return {
      can: canAccess,
      reason: canAccess ? undefined : "Anda tidak memiliki akses ke resource ini",
    };
  },
};
