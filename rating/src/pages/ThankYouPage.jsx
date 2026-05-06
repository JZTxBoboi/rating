
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("selectedTech");

    const i = setInterval(() => setCount(c => c - 1), 1000);
    setTimeout(() => navigate("/"), 5000);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="center">
      <h1>Thank you for your feedback!</h1>
      <p>Redirecting in {count} seconds...</p>
    </div>
  );
}
