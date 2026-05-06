import { motion } from 'framer-motion';

export default function RatingButton({ rating, disabled, onClick }) {
  return (
    <motion.button
      type="button"
      className={`rating-button ${rating.colorClass}`}
      onClick={() => onClick(rating)}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -5, scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      aria-label={`Rate ${rating.label}`}
    >
      <span className="rating-button__emoji" aria-hidden="true">
        {rating.emoji}
      </span>
      <span className="rating-button__label">{rating.label}</span>
      <span className="rating-button__value">{rating.value}/5</span>
    </motion.button>
  );
}
