import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import SimplePage from "./pages/SimplePage";
import ProtectedRoute from "./components/ProtectedRoute";

const WithAuth = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<WithAuth><Dashboard /></WithAuth>} />
      <Route path="/profile" element={<WithAuth><Profile /></WithAuth>} />
      <Route path="/friends" element={<WithAuth><Friends /></WithAuth>} />
      <Route path="/settings" element={<WithAuth><Settings /></WithAuth>} />
      <Route path="/saved" element={<WithAuth><SimplePage title="Saved" /></WithAuth>} />
      <Route path="/groups" element={<WithAuth><SimplePage title="Groups" /></WithAuth>} />
      <Route path="/chats" element={<WithAuth><SimplePage title="Chats" /></WithAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
