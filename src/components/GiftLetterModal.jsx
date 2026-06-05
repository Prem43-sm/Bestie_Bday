import { motion } from "framer-motion";
import { X } from "lucide-react";
import { giftLetter } from "../data/giftLetter.js";

const letterParagraphs = giftLetter.split("\n").filter(Boolean);

export default function GiftLetterModal({ onClose }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="gift-modal-backdrop"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.article
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        aria-label="Birthday gift letter"
        className="gift-letter-modal"
        exit={{ opacity: 0, scale: 0.96, y: 18, filter: "blur(8px)" }}
        initial={{ opacity: 0, scale: 0.94, y: 26, filter: "blur(10px)" }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <button aria-label="Close gift letter" className="gift-letter-close" onClick={onClose} type="button">
          <X size={17} />
        </button>
        <div className="gift-letter-scroll">
          {letterParagraphs.map((paragraph, index) =>
            index === 0 ? (
              <motion.h2
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                key={paragraph}
                transition={{ duration: 0.42, delay: 0.08 }}
              >
                {paragraph}
              </motion.h2>
            ) : (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                key={`${paragraph}-${index}`}
                transition={{ duration: 0.38, delay: 0.12 + index * 0.055 }}
              >
                {paragraph}
              </motion.p>
            ),
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}
