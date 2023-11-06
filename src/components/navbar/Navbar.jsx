import { Link } from "react-router-dom";

import "./Navbar.css";
import Temple from "../../assets/temple.svg";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="dojo logo" />
        </li>
        <span>The Dojo </span>
        {!user && (
          <>
            <li>
              <Link to="/login"> Login</Link>
            </li>
            <li>
              <Link to="/signup"> Signup</Link>
            </li>
          </>
        )}

        {user && (
          <li>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </header>
  );
}
