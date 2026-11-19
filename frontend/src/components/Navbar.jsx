import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaUser, FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="nav-logo" aria-label="My Blue App home">
        <Logo className="logo-lockup" />
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/dashboard" title="Dashboard"><FaHome /> Dashboard</NavLink>
            <NavLink to="/profile" title="My Profile"><FaUser /> My Profile</NavLink>
            <NavLink to="/friends" title="Friends"><FaUsers /> Friends</NavLink>
            <button type="button" onClick={handleLogout} className="nav-btn" title="Logout">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
