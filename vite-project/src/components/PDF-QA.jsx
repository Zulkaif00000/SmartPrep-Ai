import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Upload } from "lucide-react";
import "./Styles/PDF-QA.css";

const PDFQA = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate(); // React Router navigation hook

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  // Handle question submission
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Please upload a PDF file before asking a question.");
      return;
    }
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("question", question);

    try {
      const response = await fetch("http://localhost:5000/api/pdf-qa", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setShowAnswer(true);
    } catch (error) {
      console.error("Error fetching answer:", error);
      alert("An error occurred while fetching the answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-qa-container">
      {/* Navigation Bar */}
      <nav className="navbar5">
        <div className="navbar-brand">
          <span className="app-brand__mark" aria-hidden="true">
            <Sparkles size={15} strokeWidth={2.4} />
          </span>
          <span>smartprep<span className="app-brand__ai">.ai</span></span>
        </div>
        <button
          type="button"
          className="Dashboard"
          onClick={() => navigate("/feature")} // Navigate to Features page
        >
          <ArrowLeft size={14} strokeWidth={2.4} aria-hidden="true" />
          Dashboard
        </button>
      </nav>

      <div className="pdf-qa-layout">
        <div className="pdf-qa-intro-block">
          <span className="app-eyebrow">NOTES</span>
          <h1>AI PDF Question Answering</h1>
          <p className="pdf-qa-kicker">Upload a document and ask for answers in plain language.</p>
        </div>

        <div className="pdf-qa-columns">
          {/* PDF-QA Content */}
          <section className="pdf-qa-content" aria-labelledby="pdf-qa-form-heading">
            <h2 id="pdf-qa-form-heading" className="visually-hidden">Ask a question</h2>
            <div className="pdf-upload-section">
              <label htmlFor="pdf-upload" className="upload-label">
                <span className="upload-label__icon" aria-hidden="true">
                  <Upload size={22} strokeWidth={2} />
                </span>
                <span className="upload-label__title">Upload your PDF file</span>
                <span className="upload-label__hint">PDF only — click to choose a file</span>
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </label>
              {pdfFile && <p className="file-name">Uploaded: {pdfFile.name}</p>}
            </div>
            <form onSubmit={handleQuestionSubmit} className="question-form">
              <label className="app-field-label" htmlFor="pdf-question">Your question</label>
              <textarea
                id="pdf-question"
                placeholder="Enter your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="question-input"
              ></textarea>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Fetching Answer..." : "Get Answer"}
              </button>
            </form>
          </section>

          {/* Answer Display */}
          {showAnswer && (
            <section className="answer-container" aria-live="polite" aria-labelledby="pdf-answer-heading">
              <h3 id="pdf-answer-heading">AI Response:</h3>
              <ul className="answer-list">
                {answer.split("\n").map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFQA;
