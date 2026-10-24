import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import "./Styles/Flashcard.css";

const FlashcardApp = () => {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlashcardsActive, setIsFlashcardsActive] = useState(false);
  const [timeInterval, setTimeInterval] = useState(10);
  const [numFlashcards, setNumFlashcards] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  const [completedFlashcards, setCompletedFlashcards] = useState([]); // Store completed flashcards
  const [buttonText, setButtonText] = useState("Generate Flashcards"); // State for button text
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (timerActive && isFlashcardsActive && flashcards.length > 0) {
      const timer = setTimeout(() => {
        handleFlipCard();
      }, timeInterval * 1000);
      return () => clearTimeout(timer);
    }
  }, [timerActive, isFlashcardsActive, currentCardIndex, flashcards, timeInterval]);

  const generateFlashcards = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setButtonText("Fetching Flashcards..."); // Update button text

    try {
      const response = await fetch("http://localhost:5000/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, numFlashcards }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch flashcards: ${errorText}`);
      }

      const data = await response.json();
      const flashcardsData = data.flashcards.map((card) => ({
        front: card.front,
        back: card.back,
        isFlipped: false,
      }));

      setFlashcards(flashcardsData);
      setIsFlashcardsActive(true);
      setCurrentCardIndex(0);
      setCompletedFlashcards([]); // Reset completed flashcards
    } catch (error) {
      console.error("Error fetching flashcards:", error.message);
      alert(error.message);
    } finally {
      setButtonText("Generate Flashcards"); // Reset button text after fetching
    }
  };

  const saveFlashcardsToDatabase = async () => {
    try {
      console.log("Sending data:", {
        topic,
        flashcards: completedFlashcards,
      });
  
      const response = await fetch("http://localhost:5000/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          flashcards: completedFlashcards,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend response error:", errorText);
        throw new Error(errorText);
      }
  
      alert("Flashcards session saved successfully!");
    } catch (error) {
      console.error("Error saving flashcards to the database:", error.message);
      alert(error.message);
    }
  };
  

  const handleFlipCard = () => {
    const flippedCard = {
      ...flashcards[currentCardIndex],
      isFlipped: true,
    };
    setFlashcards((prevCards) =>
      prevCards.map((card, index) =>
        index === currentCardIndex ? flippedCard : card
      )
    );
  };

  const handleNextCard = () => {
    const currentCard = flashcards[currentCardIndex];
    setCompletedFlashcards((prevCompleted) => [
      ...prevCompleted,
      { question: currentCard.front, answer: currentCard.back },
    ]);
    if (currentCardIndex + 1 < flashcards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setTimerActive(false);
    }
  };

  const handleStart = () => {
    setTimerActive(true);
  };

  const handleSubmit = async () => {
    try {
      const lastCard = flashcards[currentCardIndex];
      if (lastCard) {
        setCompletedFlashcards((prevCompleted) => [
          ...prevCompleted,
          { question: lastCard.front, answer: lastCard.back },
        ]);
      }
      await saveFlashcardsToDatabase();
      setIsFlashcardsActive(false);
      setTimerActive(false);
      setTopic("");
      setFlashcards([]);
      setCurrentCardIndex(0);
    } catch (error) {
      console.error("Error during submission:", error.message);
    }
  };

  return (
    <div className="flashcard-app">
      {/* Navbar */}
      <header className="navbar56">
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
            className="Dashoard"
            onClick={() => navigate("/feature")}
          >
            <ArrowLeft size={14} strokeWidth={2.4} aria-hidden="true" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="flashcard-main">
        <div className="flashcard-intro-block">
          <span className="app-eyebrow">REVIEW</span>
          <h1>AI Flashcard Generator</h1>
          <p className="flashcard-kicker">Build a quick deck and flip through the essentials.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateFlashcards();
          }}
          className="search-form"
        >
          <div className="search-form__field">
            <label className="app-field-label" htmlFor="flashcard-topic">Topic</label>
            <input
              id="flashcard-topic"
              type="text"
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-form__field search-form__field--narrow">
            <label className="app-field-label" htmlFor="flashcard-count">Number of cards</label>
            <input
              id="flashcard-count"
              type="number"
              min="1"
              max="20"
              value={numFlashcards}
              onChange={(e) => setNumFlashcards(e.target.value)}
              className="flashcard-count-input"
              placeholder="Number of Flashcards"
            />
          </div>
          <button type="submit" className="search-button">
            {buttonText}
          </button>
        </form>

        {isFlashcardsActive && flashcards.length > 0 && (
          <section className="flashcard-container" aria-live="polite">
            <p className="flashcard-counter">
              Card {currentCardIndex + 1} of {flashcards.length}
            </p>
            <div
              className={`flashcard ${
                flashcards[currentCardIndex].isFlipped ? "flipped" : ""
              }`}
            >
              <div className="flashcard-front">
                {flashcards[currentCardIndex].front}
              </div>
              <div className="flashcard-back">
                {flashcards[currentCardIndex].back}
              </div>
            </div>
            <div className="flashcard-controls">
              <div className="time-settings">
                <label htmlFor="time-interval">Set Time (seconds):</label>
                <input
                  type="number"
                  id="time-interval"
                  min="5"
                  max="60"
                  value={timeInterval}
                  onChange={(e) => setTimeInterval(e.target.value)}
                  className="time-input"
                />
              </div>
              <div className="flashcard-actions">
                {currentCardIndex + 1 >= flashcards.length ? (
                  <button type="button" onClick={handleSubmit} className="submit-button">
                    Submit
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={handleStart} className="start-button">
                      Start
                    </button>
                    <button type="button" onClick={handleNextCard} className="next-button">
                      Next Flashcard
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default FlashcardApp;
