import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="navbar-brand">Smartprep AI</div>
        <button
          className="Dashboard"
          onClick={() => navigate("/feature")} // Navigate to Features page
        >
          Dashboard
        </button>
      </nav>

      {/* PDF-QA Content */}
      <div className="pdf-qa-content">
        <h1>AI PDF Question Answering</h1>
        <div className="pdf-upload-section">
          <label htmlFor="pdf-upload" className="upload-label">
            Upload your PDF file
          </label>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="file-input"
          />
          {pdfFile && <p className="file-name">Uploaded: {pdfFile.name}</p>}
        </div>
        <form onSubmit={handleQuestionSubmit} className="question-form">
          <textarea
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="question-input"
          ></textarea>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Fetching Answer..." : "Get Answer"}
          </button>
        </form>
      </div>

      {/* Answer Display */}
      {showAnswer && (
        <div className="answer-container">
          <h3>AI Response:</h3>
          <ul className="answer-list">
            {answer.split("\n").map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PDFQA;
