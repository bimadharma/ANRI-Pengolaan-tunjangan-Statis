import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-800 text-white p-4 flex justify-between">
      <div className="font-bold text-xl">
        <Link to="/">MyApp</Link>
      </div>

      <div className="flex gap-4">
        {!user && <Link to="/login">Login</Link>}

        {user && (
          <>
            <span>{user.name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
