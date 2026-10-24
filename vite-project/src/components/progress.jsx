import React, { useState, useEffect } from "react";
import "./Styles/progress.css";
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
import { Sparkles, ArrowLeft } from "lucide-react";

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
      <header className="navbar7">
        <div className="navbar-brand">
          <span className="app-brand__mark" aria-hidden="true">
            <Sparkles size={15} strokeWidth={2.4} />
          </span>
          <span>smartprep<span className="app-brand__ai">.ai</span></span>
        </div>
        <div className="navbar-links">
          <button
            type="button"
            className="Dashoard"
            onClick={() => (window.location.href = "/feature")}
          >
            <ArrowLeft size={14} strokeWidth={2.4} aria-hidden="true" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="progress-main">
        <div className="progress-intro-block">
          <span className="app-eyebrow">INSIGHTS</span>
          <h1>User Progress Overview</h1>
          <p className="progress-kicker">A calm look at how your study sessions are adding up.</p>
        </div>

        <div className="progress-summary">
          <div className="progress-stat-card">
            <span className="progress-stat-label">Total Quizzes Taken</span>
            <p className="progress-stat-value">{progressData.totalQuizzes}</p>
          </div>
          <div className="progress-stat-card">
            <span className="progress-stat-label">Quiz Completion Rate</span>
            <p className="progress-stat-value">{progressData.quizCompletionRate}%</p>
          </div>
          <div className="progress-stat-card">
            <span className="progress-stat-label">Total Flashcards Created</span>
            <p className="progress-stat-value">{progressData.totalFlashcards}</p>
          </div>
        </div>

        <div className="progress-charts">
          {/* Daily Progress Line Chart */}
          <section className="chart-container" aria-labelledby="daily-progress-heading">
            <h2 id="daily-progress-heading">Daily Progress Report</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 22, 45, 0.1)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#777181", fontSize: 12, fontWeight: 600 }}
                  stroke="#c9c4ce"
                />
                <YAxis
                  tick={{ fill: "#777181", fontSize: 12, fontWeight: 600 }}
                  stroke="#c9c4ce"
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#6d42e5"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Goal Progress Pie Chart */}
          <section className="goal-progress-container" aria-labelledby="goal-progress-heading">
            <h2 id="goal-progress-heading">Goal Completion Breakdown</h2>
            <PieResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalCompletionData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell key="quizCompletion" fill="#6d42e5" />
                  <Cell key="remaining" fill="#e4dafb" />
                </Pie>
                <PieTooltip />
              </PieChart>
            </PieResponsiveContainer>
          </section>
        </div>

        {/* Motivational Quote */}
        <section className="quote-container" aria-labelledby="quote-heading">
          <h2 id="quote-heading">Stay Motivated</h2>
          <p>{randomQuote}</p>
        </section>
      </main>
    </div>
  );
};

export default Progress;
