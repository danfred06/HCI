import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightWidget from "../components/RightWidget";

export default function SimplePage({ title }) {
  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="feed-column">
          <h2 className="page-heading">{title}</h2>
          <div className="placeholder-card">
            <p className="muted">{title} coming soon.</p>
          </div>
        </main>
        <RightWidget />
      </div>
    </>
  );
}
