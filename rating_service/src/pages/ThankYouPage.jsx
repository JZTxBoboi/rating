import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    localStorage.removeItem('selectedTechnician');

    const intervalId = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          navigate('/', { replace: true });
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [navigate]);

  return (
    <main className="page page--thank-you">
      <motion.section
        className="thank-you-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32 }}
      >
        <div className="thank-you-card__icon">
          <CheckCircle2 size={52} aria-hidden="true" />
        </div>
        <h1>Thank you for your feedback!</h1>
        <p>Redirecting in {countdown} seconds...</p>
      </motion.section>
    </main>
  );
}
