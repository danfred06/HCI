import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightWidget from "../components/RightWidget";

// The friends screen in the wireframe shows repeated "Name" entries.
export default function Friends() {
  const names = ["Name", "Name", "Name", "Name", "Name"];

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="feed-column">
          <h2 className="page-heading">Friends</h2>
          <div className="friend-list">
            {names.map((name, i) => (
              <div className="friend-card" key={i}>
                <span className="friend-avatar" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </main>
        <RightWidget />
      </div>
    </>
  );
}
