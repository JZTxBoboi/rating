import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TechnicianCard from '../components/TechnicianCard';
import { technicians } from '../data/technicians';

export default function TechnicianSelection() {
  const navigate = useNavigate();

  function handleSelect(technician) {
    localStorage.setItem('selectedTechnician', JSON.stringify(technician));
    navigate('/rating', { state: { technician } });
  }

  return (
    <main className="page page--selection">
      <section className="hero-panel">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hero-panel__content"
        >
          <p className="eyebrow">Service Feedback</p>
          <h1>Please Select Your Technician</h1>
          <p className="hero-panel__text">
            Choose the technician who served you. Your feedback helps us improve service quality.
          </p>
        </motion.div>
      </section>

      <section className="technician-grid" aria-label="Technician list">
        {technicians.map((technician, index) => (
          <motion.div
            key={technician.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
          >
            <TechnicianCard technician={technician} onSelect={handleSelect} />
          </motion.div>
        ))}
      </section>
    </main>
  );
}
