import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift } from "lucide-react";
import GiftLetterModal from "./GiftLetterModal.jsx";

export default function GiftButton() {
  const [visible, setVisible] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    const finalSection = document.querySelector(".final-section");

    const updateFromScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > 0 && scrollTop / scrollable >= 0.85);
    };

    const observer = finalSection
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(true);
            } else {
              updateFromScroll();
            }
          },
          { threshold: 0.16 },
        )
      : null;

    observer?.observe(finalSection);
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.button
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="gift-surprise-button"
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            initial={{ opacity: 0, scale: 0.86, y: 14 }}
            onClick={() => setLetterOpen(true)}
            transition={{ duration: 0.32, ease: "easeOut" }}
            type="button"
            whileHover={{ scale: 1.025, y: -2 }}
          >
            <Gift className="gift-surprise-icon" size={36} />
            <span className="gift-surprise-copy">
              <span>🎁 Open Your Birthday Gift</span>
              <small>✨ Tap Here</small>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>{letterOpen && <GiftLetterModal onClose={() => setLetterOpen(false)} />}</AnimatePresence>
    </>
  );
}
