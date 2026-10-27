import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Feature from "./components/Feature";
import Autoquiz from "./components/Autoquiz";
import Flashcard from "./components/Flashcard";
import Auth from "./components/Auth";
import PDFQA from "./components/PDF-QA";
import LandingPage from "./components/Landing-Page";
import Progress from "./components/progress"; // Import the Progress component
import ForgotPassword from "./components/FYP";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/auto-quiz" element={<Autoquiz />} />
        <Route path="/flash-card" element={<Flashcard />} />
        <Route path="/pdf-qa" element={<PDFQA />} />
        <Route path="/progress" element={<Progress />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Correct route */}

      </Routes>
    </Router>
  );
}

export default App;
