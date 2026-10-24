import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Sparkles, ArrowLeft } from "lucide-react";
import "./Styles/Autoquiz.css";

const AutoQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isResultsGenerated, setIsResultsGenerated] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [buttonText, setButtonText] = useState("Start Quiz"); // Button text state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You must be logged in to access this page.");
      window.location.href = "/login";
    }

    // Fetch user's name
    const fetchUserName = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username); // Set the username
        } else {
          console.error("Failed to fetch user name.");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [token]);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumQuestions(value > 0 ? value : 1);
  };

  const startQuiz = async () => {
    if (!difficulty || !topic) {
      alert("Please select a difficulty level and enter a topic!");
      return;
    }

    setButtonText("Fetching Questions..."); // Update button text

    try {
      const response = await fetch("http://localhost:5000/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, numQuestions, difficulty }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setQuizStarted(true);
      } else {
        alert("Error generating quiz.");
      }
    } catch (error) {
      alert("Error starting quiz. Please try again.");
    } finally {
      setButtonText("Start Quiz"); // Reset button text after fetching
    }
  };

  const handleAnswerChange = (questionIndex, selectedIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedIndex,
    }));
  };

  const handleGenerateResults = () => {
    setIsResultsGenerated(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setDifficulty("");
    setTopic("");
    setNumQuestions(5);
    setQuestions([]);
    setAnswers({});
    setIsResultsGenerated(false);
  };

  const saveQuizResults = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          difficulty,
          score: questions.filter((q, i) => answers[i] === q.correct).length,
          totalQuestions: questions.length,
          questions: questions.map((q, i) => ({
            question: q.question,
            correct: q.correct,
            userAnswer: answers[i],
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error saving results: ${errorText}`);
        return;
      }

      const data = await response.json();
      alert("Quiz results saved successfully!");
      resetQuiz(); // Reset the quiz after saving results
    } catch (error) {
      console.error("Error saving quiz results:", error.message);
      alert("Failed to save quiz results. Please try again.");
    }
  };

  return (
    <div className="auto-quiz-container">
      {/* Navbar */}
      <header className="navbar4">
        <div className="navbar-left">
          <span className="navbar-brand">
            <span className="app-brand__mark" aria-hidden="true">
              <Sparkles size={15} strokeWidth={2.4} />
            </span>
            <span>smartprep<span className="app-brand__ai">.ai</span></span>
          </span>
        </div>
        <div className="navbar-right">
          <button
            type="button"
            className="Dashboard"
            onClick={() => navigate("/feature")}
          >
            <ArrowLeft size={14} strokeWidth={2.4} aria-hidden="true" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="auto-quiz-main">
        <div className="auto-quiz-intro-block">
          <span className="app-eyebrow">PRACTICE</span>
          <h1>AI Auto Quiz</h1>
          {userName ? (
            <p className="auto-quiz-user-hint">Ready when you are, {userName}.</p>
          ) : null}
        </div>

        {!quizStarted && (
          <section className="quiz-intro" aria-labelledby="quiz-setup-heading">
            <h2 id="quiz-setup-heading" className="visually-hidden">Quiz setup</h2>
            <p>Customize your quiz by selecting options below:</p>
            <div className="quiz-settings">
              <label className="app-field-label" htmlFor="quiz-topic">Topic</label>
              <input
                id="quiz-topic"
                type="text"
                placeholder="Enter topic"
                value={topic}
                onChange={handleTopicChange}
                className="topic-input"
              />
              <label className="app-field-label" htmlFor="quiz-num">Number of questions</label>
              <input
                id="quiz-num"
                type="number"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                className="num-questions-input"
                min="1"
              />
              <span className="app-field-label" id="difficulty-label">Difficulty</span>
              <div
                className="difficulty-buttons"
                role="group"
                aria-labelledby="difficulty-label"
              >
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    className={`difficulty-button ${
                      difficulty === level ? "selected" : ""
                    }`}
                    aria-pressed={difficulty === level}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <button type="button" onClick={startQuiz} className="start-button">
                {buttonText}
              </button>
            </div>
          </section>
        )}

        {quizStarted && (
          <section className="quiz-section" aria-labelledby="quiz-heading">
            <h2 id="quiz-heading" className="quiz-heading">Check Your Knowledge</h2>
            {questions.map((question, index) => (
              <div key={index} className="question-container">
                <h3>
                  {index + 1}. {question.question}
                </h3>
                <div className="options" role="radiogroup" aria-label={`Question ${index + 1}`}>
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[index] === optionIndex;
                    const isCorrect = question.correct === optionIndex;

                    let optionClass = "";
                    if (isResultsGenerated) {
                      if (isCorrect) {
                        optionClass = "correct"; // Highlight correct answer
                      } else if (isSelected) {
                        optionClass = "incorrect"; // Highlight wrong selection
                      }
                    } else if (isSelected) {
                      optionClass = "selected"; // Highlight current selection
                    }

                    return (
                      <label key={optionIndex} className={`option-label ${optionClass}`}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(index, optionIndex)}
                          disabled={isResultsGenerated}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="quiz-actions">
              {!isResultsGenerated && (
                <button
                  type="button"
                  onClick={handleGenerateResults}
                  className="generate-results-button"
                >
                  Check your answers
                </button>
              )}
              {isResultsGenerated && (
                <button
                  type="button"
                  onClick={saveQuizResults}
                  className="save-results-button"
                >
                  Submit Results
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AutoQuiz;
