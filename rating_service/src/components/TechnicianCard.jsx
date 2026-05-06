import { motion } from 'framer-motion';

export default function TechnicianCard({ technician, onSelect }) {
  return (
    <motion.button
      type="button"
      className="technician-card"
      onClick={() => onSelect(technician)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Select technician ${technician.name}`}
    >
      <img
        className="technician-card__image"
        src={technician.image}
        alt={`${technician.name} technician profile`}
        loading="lazy"
      />
      <div className="technician-card__body">
        <p className="technician-card__name">{technician.name}</p>
        <p className="technician-card__id">{technician.id}</p>
      </div>
    </motion.button>
  );
}
