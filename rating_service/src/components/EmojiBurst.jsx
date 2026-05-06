import { AnimatePresence, motion } from 'framer-motion';

const angles = [-140, -110, -80, -45, -10, 20, 55, 90, 125, 160, 205, 250];

export default function EmojiBurst({ emoji, burstKey }) {
  if (!emoji) return null;

  return (
    <div className="emoji-burst" aria-hidden="true">
      <AnimatePresence>
        {angles.map((angle, index) => {
          const distance = 70 + (index % 4) * 16;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;

          return (
            <motion.span
              key={`${burstKey}-${index}`}
              className="emoji-burst__particle"
              initial={{ opacity: 1, scale: 0.6, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, scale: 1.3, x, y, rotate: angle }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {emoji}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
