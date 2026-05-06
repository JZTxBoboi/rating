
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TechnicianSelection from "./pages/TechnicianSelection";
import RatingPage from "./pages/RatingPage";
import ThankYouPage from "./pages/ThankYouPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TechnicianSelection />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  );
}
