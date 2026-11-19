export default function Avatar({ user, size = "md" }) {
  if (user?.avatar_url) {
    return <img className={`avatar ${size}`} src={user.avatar_url} alt={user.username} />;
  }

  return (
    <img
      className={`avatar avatar-fallback ${size}`}
      src="/logo-mark.png"
      alt={user?.username || "User"}
    />
  );
}
