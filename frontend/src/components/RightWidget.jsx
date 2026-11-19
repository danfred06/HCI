import { Link } from "react-router-dom";

export default function RightWidget() {
  return (
    <aside className="right-widget">
      <Link to="/friends" className="widget-title">Find friends</Link>
      <div className="widget-body">
        <p className="muted">Suggestions coming soon</p>
      </div>
    </aside>
  );
}
