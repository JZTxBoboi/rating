
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitRating } from "../services/googleSheetService";

export default function RatingPage() {
  const [tech, setTech] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem("selectedTech"));
    if (!t) navigate("/");
    else setTech(t);
  }, []);

  const handleRate = async () => {
    await submitRating({
      technicianId: tech.id,
      technicianName: tech.name,
      ratingValue: 5
    });
    navigate("/thank-you");
  };

  if (!tech) return null;

  return (
    <div className="center">
      <h2>{tech.name}</h2>
      <button onClick={handleRate}>Submit Rating</button>
    </div>
  );
}
