
import { technicians } from "../data/technicians";
import { useNavigate } from "react-router-dom";

export default function TechnicianSelection() {
  const navigate = useNavigate();

  const selectTech = (tech) => {
    localStorage.setItem("selectedTech", JSON.stringify(tech));
    navigate("/rating");
  };

  return (
    <div className="container">
      <h1>Please Select Your Technician</h1>
      <div className="grid">
        {technicians.map((t) => (
          <div key={t.id} className="card" onClick={() => selectTech(t)}>
            <img src={t.img} width="80" />
            <h3>{t.name}</h3>
            <p>{t.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
