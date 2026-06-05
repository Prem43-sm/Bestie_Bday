import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer.jsx";

export default function PlaylistPanel({ playlist, currentIndex, isPlaying, volume, onSelect, onVolumeChange }) {
  const playlistRef = useRef(null);

  useEffect(() => {
    const playlistElement = playlistRef.current;
    if (!playlistElement) return;

    const handleWheel = (event) => {
      const { deltaY } = event;
      const atTop = playlistElement.scrollTop <= 0;
      const atBottom =
        playlistElement.scrollTop + playlistElement.clientHeight >= playlistElement.scrollHeight - 1;

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        event.stopPropagation();
      }
    };

    playlistElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => playlistElement.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="playlist-panel" role="dialog" aria-label="Music playlist">
      <div className="playlist-list" ref={playlistRef}>
        {playlist.map((song, index) => {
          const active = index === currentIndex;

          return (
            <button
              className={`playlist-track ${active ? "is-current" : ""}`}
              key={song.file}
              onClick={() => onSelect(index)}
              type="button"
            >
              <AudioVisualizer active={active && isPlaying} />
              <span>{song.title}</span>
            </button>
          );
        })}
      </div>
      <label className="playlist-volume">
        <Volume2 size={15} />
        <input
          aria-label="Music volume"
          max="1"
          min="0"
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          step="0.01"
          type="range"
          value={volume}
        />
      </label>
    </div>
  );
}
