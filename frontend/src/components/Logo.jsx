// Uses the exact wordmark cropped from the supplied screenshots (dark navy on transparent)
export default function Logo({ className = "" }) {
  return <img src="/logo.png" alt="My Blue App" className={className} />;
}
