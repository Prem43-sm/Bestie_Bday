import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { feelingCards, photos } from "./data.js";
import birthdaySong from "./music/Jaane Kyun LYRICS I Borora Music.mp3";

gsap.registerPlugin(ScrollTrigger);

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      smoothWheel: true,
    });

    const raf = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

function useAmbientSound() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  const stop = () => {
    audioRef.current?.pause();
    setEnabled(false);
  };

  const start = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setEnabled(true);
    } catch {
      setEnabled(false);
    }
  };

  const toggle = () => {
    if (enabled) {
      stop();
      setEnabled(false);
    } else {
      start();
    }
  };

  useEffect(() => {
    const audio = new Audio(birthdaySong);
    audio.loop = true;
    audio.volume = 0.42;
    audio.preload = "auto";
    audioRef.current = audio;

    start();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return { enabled, start, toggle };
}

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 90, damping: 24 });
  const springY = useSpring(y, { stiffness: 90, damping: 24 });

  useEffect(() => {
    const onMove = (event) => {
      x.set(event.clientX - 160);
      y.set(event.clientY - 160);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return <motion.div className="cursor-glow" style={{ x: springX, y: springY }} />;
}

function Particles({ count = 34, petals = false }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 7,
        size: petals ? 8 + Math.random() * 13 : 2 + Math.random() * 4,
        duration: petals ? 9 + Math.random() * 9 : 5 + Math.random() * 8,
      })),
    [count, petals],
  );

  return (
    <div className={petals ? "petal-field" : "particle-field"} aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          style={{
            left: `${item.left}%`,
            width: item.size,
            height: petals ? item.size * 1.55 : item.size,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function MagneticButton({ children, onClick, icon }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const move = (event) => {
      const rect = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.18,
        y: (event.clientY - rect.top - rect.height / 2) * 0.18,
        duration: 0.35,
        ease: "power3.out",
      });
    };
    const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.35)" });

    element.addEventListener("mousemove", move);
    element.addEventListener("mouseleave", leave);
    return () => {
      element.removeEventListener("mousemove", move);
      element.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <button ref={ref} className="magnetic-button" onClick={onClick} type="button">
      <span>{children}</span>
      {icon}
    </button>
  );
}

function LoadingIntro({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 4300);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
    >
      <motion.img
        className="loading-photo"
        src={photos.intro}
        alt="A warm birthday memory"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.6, ease: "easeOut" }}
      />
      <div className="loading-veil" />
      <Particles count={42} />
      <div className="loading-copy">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
        >
          before the journey begins
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{ duration: 1.15, delay: 0.55, ease: "easeOut" }}
        >
          Some birthdays feel like a quiet thank-you...
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.15, delay: 1.1, ease: "easeOut" }}
        >
          Today is for someone who made life feel lighter.
        </motion.p>
      </div>
    </motion.div>
  );
}

function Hero({ onBegin }) {
  return (
    <section className="hero section" id="hero">
      <motion.img
        className="hero-image"
        src={photos.hero}
        alt="Gayatri by the riverside"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
      />
      <div className="sun-rays" />
      <div className="fog-layer" />
      <Particles count={36} />
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 44, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.5, delay: 0.35 }}
      >
        <p className="eyebrow">A birthday letter for my best friend</p>
        <h1>
          To one of the most important people in my life,
          <span>Happy Birthday Gayatri</span>
        </h1>
        <p className="subtitle">
          You stayed beside me in the moments
          <span>when I felt completely alone.</span>
        </p>
        <p className="hero-note">Some people enter life quietly... and become the reason it feels lighter.</p>
        <MagneticButton onClick={onBegin} icon={<Play size={18} />}>
          Begin the Journey
        </MagneticButton>
      </motion.div>
    </section>
  );
}

function StoryWalk() {
  return (
    <section className="story-section section" id="story">
      <div className="section-heading reveal">
        <p className="eyebrow">A friendship that became home</p>
        <h2>Little moments that became priceless memories.</h2>
        <p className="intro-letter">
          There are people we meet... and then there are people who slowly become home.
          You were never just a friend to me. You became comfort. Support. Peace.
          And one of the strongest reasons my college days became beautiful memories.
        </p>
      </div>
      {photos.story.map((item, index) => (
        <article className={`story-row reveal ${index % 2 ? "reverse" : ""}`} key={item.title}>
          <div className="story-image-wrap parallax-image">
            <img src={item.image} alt={item.title} loading="lazy" />
          </div>
          <div className="story-text">
            <p className="eyebrow">{item.kicker}</p>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery-section section" id="gallery">
      <div className="section-heading reveal">
        <p className="eyebrow">Pieces I deeply value</p>
        <h2>Not just memories. Pieces of a friendship I deeply value.</h2>
        <p className="section-subtitle">
          These moments may look simple... but they mean more to me than words can explain.
        </p>
      </div>
      <div className="editorial-gallery">
        {photos.gallery.map((image, index) => (
          <motion.figure
            className={`gallery-card card-${index + 1} reveal`}
            key={image}
            whileHover={{ y: -10, scale: 1.025, rotate: index % 2 ? -1 : 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <img src={image} alt={`Memory ${index + 1}`} loading="lazy" />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Feelings() {
  return (
    <section className="feelings-section section">
      <Particles count={28} />
      <div className="section-heading reveal">
        <p className="eyebrow">What you carry quietly</p>
        <h2>The kind of person the world needs more of.</h2>
      </div>
      <div className="feeling-grid">
        {feelingCards.map(([title, copy]) => (
          <motion.article className="feeling-card reveal" key={title} whileHover={{ y: -12, scale: 1.02 }}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Kindness() {
  return (
    <section className="kindness-section section">
      <img src={photos.dog} alt="Gayatri sharing a peaceful riverside moment" loading="lazy" />
      <div className="kindness-overlay" />
      <div className="kindness-copy reveal">
        <p className="eyebrow">Kindness & soul</p>
        <h2>The people with the softest hearts often carry the strongest souls.</h2>
        <p>
          You helped me emotionally more times than you probably realize. And I honestly do not think
          my college life would have been the same without you.
        </p>
      </div>
    </section>
  );
}

function BirthdayReveal() {
  return (
    <section className="birthday-reveal section">
      <Particles count={46} petals />
      <div className="golden-orbit" />
      <motion.div className="reveal-message reveal" whileInView={{ scale: [0.96, 1] }} viewport={{ once: true }}>
        <p className="eyebrow">A special birthday moment</p>
        <h2>
          Today is special...
          <span>because someone incredibly valuable was born.</span>
        </h2>
        <p className="reveal-body">
          And I truly hope life always gives you the happiness, peace, success, love, and care you deserve.
          The world feels softer with people like you in it.
        </p>
      </motion.div>
    </section>
  );
}

function FinalMessage() {
  return (
    <section className="final-section section">
      <img src={photos.final} alt="A peaceful riverside memory" loading="lazy" />
      <div className="final-haze" />
      <Particles count={40} />
      <div className="final-copy">
        <h2>
          No matter where life takes us,
          <span>I never want this friendship to fade.</span>
        </h2>
        <p>
          Because some people become too important to lose. And for me... you are one of those people.
        </p>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Thank you for every moment, every conversation, every time you stayed, every time you supported me,
          and every time you made life feel lighter.
        </motion.p>
        <h3>
          Keep smiling. Keep shining.
          <span>Keep becoming the amazing person you already are.</span>
          <span>Happy Birthday Gayatri</span>
        </h3>
        <p className="last-line">You are deeply appreciated. More than you know.</p>
      </div>
    </section>
  );
}

function MusicControl({ enabled, onToggle }) {
  return (
    <button className="music-control" onClick={onToggle} type="button" aria-label="Toggle ambient music">
      {enabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
      {enabled ? <Pause size={15} /> : <Play size={15} />}
    </button>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const sound = useAmbientSound();
  useSmoothScroll();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 70, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 82%" },
          },
        );
      });

      gsap.utils.toArray(".parallax-image img").forEach((image) => {
        gsap.to(image, {
          yPercent: -10,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 1.1 },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const beginJourney = () => {
    sound.start();
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <CursorGlow />
      <AnimatePresence>{loading && <LoadingIntro onComplete={() => setLoading(false)} />}</AnimatePresence>
      <main>
        <Hero onBegin={beginJourney} />
        <StoryWalk />
        <Gallery />
        <Feelings />
        <Kindness />
        <BirthdayReveal />
        <FinalMessage />
      </main>
      <MusicControl enabled={sound.enabled} onToggle={sound.toggle} />
    </>
  );
}
