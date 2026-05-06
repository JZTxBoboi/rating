import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import EmojiBurst from '../components/EmojiBurst';
import LoadingButton from '../components/LoadingButton';
import RatingButton from '../components/RatingButton';
import { saveRating } from '../services/googleSheetService';
import { getDeviceType, getUserAgent } from '../utils/deviceHelpers';
import { ratings } from '../utils/ratingHelpers';

function getStoredTechnician() {
  try {
    return JSON.parse(localStorage.getItem('selectedTechnician'));
  } catch {
    return null;
  }
}

export default function RatingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [technician, setTechnician] = useState(location.state?.technician || null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [burstKey, setBurstKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');
  const submissionLockRef = useRef(false);

  useEffect(() => {
    if (!technician) {
      const stored = getStoredTechnician();
      if (stored?.id && stored?.name) {
        setTechnician(stored);
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, technician]);

  const canSubmit = useMemo(() => Boolean(technician && selectedRating && !isSaving && !hasSubmitted), [
    technician,
    selectedRating,
    isSaving,
    hasSubmitted,
  ]);

  async function submitRating(ratingToSubmit = selectedRating) {
    if (!technician || !ratingToSubmit || isSaving || hasSubmitted || submissionLockRef.current) return;

    submissionLockRef.current = true;
    setError('');
    setIsSaving(true);
    let succeeded = false;

    try {
      await saveRating({
        technicianId: technician.id,
        technicianName: technician.name,
        ratingValue: ratingToSubmit.value,
        ratingLabel: ratingToSubmit.label,
        emojiSelected: ratingToSubmit.emoji,
        deviceType: getDeviceType(),
        userAgent: getUserAgent(),
      });

      succeeded = true;
      setHasSubmitted(true);
      localStorage.removeItem('selectedTechnician');
      navigate('/thank-you', { replace: true });
    } catch (submissionError) {
      console.error(submissionError);
      setError('Unable to save your rating. Please try again.');
    } finally {
      if (!succeeded) {
        submissionLockRef.current = false;
        setIsSaving(false);
      }
    }
  }

  function handleRatingClick(rating) {
    if (isSaving || hasSubmitted) return;
    setSelectedRating(rating);
    setBurstKey((current) => current + 1);
    submitRating(rating);
  }

  function handleBack() {
    localStorage.removeItem('selectedTechnician');
    navigate('/');
  }

  if (!technician) return null;

  return (
    <main className="page page--rating">
      <BackButton onClick={handleBack} label="Select another technician" />

      <motion.section
        className="rating-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <div className="selected-technician">
          <img src={technician.image} alt={`${technician.name} technician profile`} />
          <div>
            <p className="eyebrow">You are rating</p>
            <h1>{technician.name}</h1>
            <p>{technician.id}</p>
          </div>
        </div>

        <div className="rating-copy">
          <h2>How was the service?</h2>
          <p>Tap one emoji. The rating will be saved immediately.</p>
        </div>

        <div className="rating-stage">
          <EmojiBurst emoji={selectedRating?.emoji} burstKey={burstKey} />
          <div className="rating-grid" aria-label="Rating choices">
            {ratings.map((rating) => (
              <RatingButton
                key={rating.value}
                rating={rating}
                disabled={isSaving || hasSubmitted}
                onClick={handleRatingClick}
              />
            ))}
          </div>
        </div>

        {isSaving ? (
          <div className="saving-state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            Saving your rating...
          </div>
        ) : null}

        {error ? (
          <div className="error-card" role="alert">
            <p>{error}</p>
            <LoadingButton loading={isSaving} disabled={!canSubmit} onClick={() => submitRating()} loadingText="Retrying...">
              Retry
            </LoadingButton>
          </div>
        ) : null}
      </motion.section>
    </main>
  );
}
