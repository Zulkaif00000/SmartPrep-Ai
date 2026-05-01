import React, { useState, useEffect } from "react";
import "./styles/progress.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer as PieResponsiveContainer,
} from "recharts";

const Progress = () => {
  const [progressData, setProgressData] = useState({
    totalQuizzes: 0,
    quizCompletionRate: 0,
    totalFlashcards: 0,
  });

  const [dailyProgress, setDailyProgress] = useState([]);
  const [motivationalQuotes] = useState([
    "Success is the sum of small efforts, repeated day in and day out. Don't watch the clock, do what it does. Keep going. The future depends on what you do today.",
  ]);
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    // Fetch user progress data
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress data.");
        }

        const data = await response.json();
        setProgressData(data);

        // Simulate daily progress based on fetched data
        setDailyProgress([
          { day: "Mon", progress: Math.min(data.quizCompletionRate, 10) },
          { day: "Tue", progress: Math.min(data.quizCompletionRate, 20) },
          { day: "Wed", progress: Math.min(data.quizCompletionRate, 30) },
          { day: "Thu", progress: Math.min(data.quizCompletionRate, 40) },
          { day: "Fri", progress: Math.min(data.quizCompletionRate, 50) },
          { day: "Sat", progress: Math.min(data.quizCompletionRate, 60) },
          { day: "Sun", progress: Math.min(data.quizCompletionRate, 70) },
        ]);
      } catch (error) {
        console.error("Error fetching progress data:", error.message);
      }
    };

    fetchProgress();

    // Select a random quote on load
    setRandomQuote(
      motivationalQuotes[
        Math.floor(Math.random() * motivationalQuotes.length)
      ]
    );
  }, [motivationalQuotes]);

  const goalCompletionData = [
    {
      name: "Quiz Completion Rate",
      value: progressData.quizCompletionRate,
    },
    { name: "Remaining", value: 100 - progressData.quizCompletionRate },
  ];

  return (
    <div className="progress-container">
      {/* Navbar */}
      <div className="navbar7">
        <div className="navbar-brand">SmartPrep AI</div>
        <div className="navbar-links">
          <button
            className="Dashoard"
            onClick={() => (window.location.href = "/feature")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <h1>User Progress Overview</h1>
      <div className="progress-summary">
        <p>Total Quizzes Taken: {progressData.totalQuizzes}</p>
        <p>Quiz Completion Rate: {progressData.quizCompletionRate}%</p>
        <p>Total Flashcards Created: {progressData.totalFlashcards}</p>
      </div>

      {/* Daily Progress Line Chart */}
      <div className="chart-container">
        <h2>Daily Progress Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
    dataKey="day"
    tick={{ fill: "#ffffff", fontSize: 14, fontWeight: "bold" }} // Custom tick styles
    stroke="#ffffff" // Optional: Changes the axis line color
  />
    <YAxis
    tick={{ fill: "#ffffff", fontSize: 14, fontWeight: "bold" }}
    stroke="#ffffff"
  />
  
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#4caf50"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Goal Progress Pie Chart */}
      <div className="goal-progress-container">
        <h2>Goal Completion Breakdown</h2>
        <PieResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={goalCompletionData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              <Cell key="quizCompletion" fill="#4caf50" />
              <Cell key="remaining" fill="#ff9800" />
            </Pie>
            <PieTooltip />
          </PieChart>
        </PieResponsiveContainer>
      </div>

      {/* Motivational Quote */}
      <div className="quote-container">
        <h2>Stay Motivated</h2>
        <p>{randomQuote}</p>
      </div>
    </div>
  );
};

export default Progress;
