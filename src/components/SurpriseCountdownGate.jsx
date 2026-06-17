import { useEffect, useMemo, useRef, useState } from "react";
import "../countdownGate.css";

// HERO IMAGE CONFIGURATION - replace this path when you want to change the countdown photo.
const HERO_IMAGE = "src\\assets\\images\\Snapchat-47847385.jpg";
const TARGET_DATE = new Date(2026, 5, 19, 0, 0, 0);
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const heroImages = import.meta.glob("../assets/images/*", { eager: true, query: "?url", import: "default" });

function resolveHeroImage() {
  const heroImageKey = `../${HERO_IMAGE.replace(/^src[\\/]/, "").replaceAll("\\", "/")}`;
  return heroImages[heroImageKey];
}

function getRemainingTime() {
  const remaining = Math.max(TARGET_DATE.getTime() - Date.now(), 0);

  return {
    total: remaining,
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

export function isCountdownUnlocked() {
  return getRemainingTime().total <= 0;
}

export default function SurpriseCountdownGate({ onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const gateRef = useRef(null);
  const heroImage = resolveHeroImage();

  const particles = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => ({
        id: index,
        left: `${(index * 19 + 7) % 100}%`,
        top: `${(index * 23 + 13) % 100}%`,
        size: `${1 + ((index * 5) % 4)}px`,
        delay: `${(index * 0.37) % 8}s`,
        duration: `${10 + ((index * 3) % 10)}s`,
      })),
    [],
  );

  useEffect(() => {
    const preloaderTimer = window.setTimeout(() => setIsLoading(false), 1500);
    return () => window.clearTimeout(preloaderTimer);
  }, []);

  useEffect(() => {
    document.body.classList.add("countdown-gate-locked");

    return () => {
      document.body.classList.remove("countdown-gate-locked");
    };
  }, []);

  useEffect(() => {
    if (timeLeft.total > 0) {
      return undefined;
    }

    setIsLeaving(true);
    const unlockTimer = window.setTimeout(onUnlock, 2600);
    return () => window.clearTimeout(unlockTimer);
  }, [onUnlock, timeLeft.total]);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setTimeLeft(getRemainingTime());
    }, 1000);

    return () => window.clearInterval(ticker);
  }, []);

  const handlePointerMove = (event) => {
    const element = gateRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.setProperty("--parallax-x", `${x * 24}px`);
    element.style.setProperty("--parallax-y", `${y * 18}px`);
    element.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };

  const units = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ];

  return (
    <section
      ref={gateRef}
      className={`countdown-gate ${isLoading ? "is-loading" : ""} ${isLeaving ? "is-leaving" : ""}`}
      aria-label="Private birthday countdown"
      onPointerMove={handlePointerMove}
    >
      <div className="countdown-gate__preloader" aria-hidden={!isLoading}>
        <div className="countdown-gate__loader-mark" />
        <p>Preparing Something Special...</p>
      </div>

      <div className="countdown-gate__aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="countdown-gate__particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            style={{
              "--left": particle.left,
              "--top": particle.top,
              "--size": particle.size,
              "--delay": particle.delay,
              "--duration": particle.duration,
            }}
          />
        ))}
      </div>

      <div className="countdown-gate__stage">
        <p className="countdown-gate__badge">Private Birthday Experience</p>

        <div className="countdown-gate__image-card">
          <img src={heroImage} alt="Private birthday experience" />
        </div>

        <h1>A Beautiful Surprise Awaits</h1>
        <p className="countdown-gate__subtitle">The Story Begins In...</p>

        <div className="countdown-gate__timer" aria-live="polite">
          {units.map(([label, value]) => (
            <div className="countdown-gate__block" key={label}>
              <span className="countdown-gate__number" key={`${label}-${value}`}>
                {formatNumber(value)}
              </span>
              <span className="countdown-gate__label">{label}</span>
            </div>
          ))}
        </div>

        <div className="countdown-gate__bottom">
          <p>Unlocks on 19 June 2026</p>
          <p>Until then, let the mystery remain...</p>
        </div>
      </div>
    </section>
  );
}
