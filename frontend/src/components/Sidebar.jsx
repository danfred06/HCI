import { NavLink } from "react-router-dom";
import { FaSearch, FaNewspaper, FaBookmark, FaUsers, FaComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <label className="side-search">
        <FaSearch />
        <input type="search" placeholder="search" aria-label="Search" />
      </label>

      <NavLink to="/profile" className="side-profile">
        <Avatar user={user} />
        <span>{user?.username || "Name"}</span>
      </NavLink>

      <nav className="side-nav">
        <NavLink to="/dashboard"><FaNewspaper /> News Feed</NavLink>
        <NavLink to="/saved"><FaBookmark /> Saved</NavLink>
        <NavLink to="/groups"><FaUsers /> Groups</NavLink>
      </nav>

      <NavLink to="/chats" className="side-chats"><FaComments /> Chats</NavLink>
    </aside>
  );
}
