import { createContext, useContext } from "react";
import { IUser } from "../interfaces/auth";

export const AuthContext = createContext<IUser | null>(null);
export const useAuthContext = () => useContext(AuthContext);
