
const BASE_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const submitRating = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
};
