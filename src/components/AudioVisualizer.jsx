export default function AudioVisualizer({ active }) {
  return (
    <span className={`audio-visualizer ${active ? "is-active" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
