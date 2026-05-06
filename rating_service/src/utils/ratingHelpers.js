export const ratings = [
  {
    value: 1,
    label: 'Very Unsatisfied',
    emoji: '😡',
    colorClass: 'rating-red',
  },
  {
    value: 2,
    label: 'Unsatisfied',
    emoji: '🙁',
    colorClass: 'rating-orange',
  },
  {
    value: 3,
    label: 'Neutral',
    emoji: '😐',
    colorClass: 'rating-yellow',
  },
  {
    value: 4,
    label: 'Satisfied',
    emoji: '🙂',
    colorClass: 'rating-light-green',
  },
  {
    value: 5,
    label: 'Excellent',
    emoji: '😄',
    colorClass: 'rating-green',
  },
];

export function formatRating(value) {
  const rating = ratings.find((item) => item.value === Number(value));
  return rating ?? ratings[2];
}

export function average(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, value) => sum + Number(value), 0) / numbers.length;
}

export function roundToOne(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

export function getRatingTone(value) {
  if (value >= 4.5) return 'excellent';
  if (value >= 4) return 'good';
  if (value >= 3) return 'neutral';
  if (value >= 2) return 'weak';
  return 'poor';
}
