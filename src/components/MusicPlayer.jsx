import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListMusic, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { playlist } from "../data/musicPlaylist.js";
import AudioVisualizer from "./AudioVisualizer.jsx";
import PlaylistPanel from "./PlaylistPanel.jsx";

const STORAGE_KEY = "gayatriBirthdayMusic";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
};

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.42);

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");

    if (Number.isInteger(saved.currentIndex) && saved.currentIndex >= 0 && saved.currentIndex < playlist.length) {
      setCurrentIndex(saved.currentIndex);
    }

    if (typeof saved.volume === "number") {
      setVolume(Math.min(1, Math.max(0, saved.volume)));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, volume }));
  }, [currentIndex, volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.file;
    audioRef.current.load();
    setProgress(0);
    setDuration(0);

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying]);

  const hasPlaylist = playlist.length > 0;

  const goToTrack = (index, shouldPlay = isPlaying) => {
    if (!hasPlaylist) return;
    const nextIndex = (index + playlist.length) % playlist.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(shouldPlay);
  };

  const togglePlayback = async () => {
    if (!audioRef.current || !hasPlaylist) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, (progress / duration) * 100);
  }, [duration, progress]);

  if (!hasPlaylist) return null;

  return (
    <div className={`music-player-shell ${isPlaying ? "is-playing" : ""}`}>
      <AnimatePresence>
        {playlistOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <PlaylistPanel
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              onSelect={(index) => goToTrack(index, true)}
              onVolumeChange={setVolume}
              playlist={playlist}
              volume={volume}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="music-player">
        <div className="music-progress" style={{ "--progress": `${progressPercent}%` }} />
        <button aria-label="Previous track" onClick={() => goToTrack(currentIndex - 1, true)} type="button">
          <SkipBack size={17} />
        </button>
        <button
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="music-play-button"
          onClick={togglePlayback}
          type="button"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button aria-label="Next track" onClick={() => goToTrack(currentIndex + 1, true)} type="button">
          <SkipForward size={17} />
        </button>
        <div className="music-meta" aria-live="polite">
          <AudioVisualizer active={isPlaying} />
          <span>{currentSong.title}</span>
          <small>{formatTime(progress)} / {formatTime(duration)}</small>
        </div>
        <button
          aria-expanded={playlistOpen}
          aria-label="Toggle playlist"
          onClick={() => setPlaylistOpen((open) => !open)}
          type="button"
        >
          <ListMusic size={18} />
        </button>
      </div>
      <audio
        onEnded={() => goToTrack(currentIndex + 1, true)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        ref={audioRef}
      />
    </div>
  );
}
