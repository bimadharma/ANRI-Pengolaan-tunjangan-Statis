export interface IUser {
  id: number;
  username: string;
  password?: string;
  role: "user" | "admin";
  name: string;
}
