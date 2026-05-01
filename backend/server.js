import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import * as pdfjsLib from "pdfjs-dist";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config(); // Load environment variables



// App Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// PostgreSQL Pool Configuration
const pool = new Pool({
  user: process.env.DB_USER  || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user; // Add user data to the request
    next();
  });
};
// Register User
app.post("/api/users/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create(username, email, passwordHash);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login User
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
});



// Check database connection
// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to the database successfully!");

  // Test query
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      console.error("Error executing test query:", err.message);
    } else {
      console.log("Test query result:", result.rows);
    }
  });
});




// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer Setup for File Uploads
const upload = multer({ dest: "uploads/" });

// User Model
const User = {
  create: async (username, email, passwordHash) => {
    const result = await pool.query(
      "INSERT INTO public.users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, passwordHash]
    );
    return result.rows[0];
  },
  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM public.users WHERE email = $1", [email]);
    return result.rows[0];
  },
  update: async (id, username, email) => {
    const result = await pool.query(
      "UPDATE public.users SET username = $1, email = $2 WHERE id = $3 RETURNING *",
      [username, email, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query("DELETE FROM public.users WHERE id = $1", [id]);
  },
};

// Function to Extract Text from PDF
const extractTextFromPDF = async (filePath) => {
  const pdfBuffer = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(pdfBuffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    extractedText += content.items.map((item) => item.str).join(" ");
  }

  if (!extractedText.trim()) {
    throw new Error("No text could be extracted from the PDF.");
  }

  return extractedText;
};

// Function to Fetch a Quiz from OpenAI
const getQuizFromOpenAI = async (topic, numQuestions, difficulty) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Generate a quiz with ${numQuestions} multiple-choice questions about "${topic}". 
                    Each question should have 4 options and indicate the correct answer. 
                    Make the difficulty level "${difficulty}". Provide the result as structured JSON, with each entry having:
                    - question (string)
                    - options (array of 4 strings)
                    - correct (index of correct option, 0-based).`,
        },
      ],
    });
    
    const quiz = JSON.parse(response.choices[0].message.content.trim());
    return quiz;
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    throw new Error("Failed to generate quiz from OpenAI:", error.message);
  }
  
  
};


app.post("/api/quizzes/submit", authenticateToken, async (req, res) => {
  try {
    const { topic, difficulty, score, totalQuestions, questions } = req.body;
    const userId = req.user.id;

    if (!topic || !difficulty || score === undefined || !totalQuestions || !questions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert quiz summary
    const quizResult = await pool.query(
      `INSERT INTO public.quizzes (user_id, topic, difficulty, score, total_questions)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, topic, difficulty, score, totalQuestions]
    );

    const quizId = quizResult.rows[0]?.id;

    if (!quizId) {
      return res.status(500).json({ error: "Failed to create quiz" });
    }

    // Insert questions
    const questionInsertPromises = questions.map((q) =>
      pool.query(
        `INSERT INTO public.questions (quiz_id, question_text, correct_answer, user_answer, is_correct)
         VALUES ($1, $2, $3, $4, $5)`,
        [quizId, q.question, q.correct, q.userAnswer, q.userAnswer === q.correct]
      )
    );

    await Promise.all(questionInsertPromises);

    res.status(201).json({ message: "Quiz results saved successfully!" });
  } catch (error) {
    console.error("Error saving quiz results:", error.message);
    res.status(500).json({ error: error.message });
  }
});



// Function to Fetch Flashcards from OpenAI
const getFlashcardsFromOpenAI = async (topic, numFlashcards) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Generate ${numFlashcards} flashcards about "${topic}". 
                    Each flashcard should have a term or question for the front and a detailed explanation for the back. 
                    Provide the result as structured JSON, with each entry having:
                    - front (string, term or question)
                    - back (string, detailed explanation).`,
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    const flashcards = JSON.parse(response.choices[0].message.content.trim());
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid format from OpenAI. Expected an array of flashcards.");
    }

    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error.message);
    throw new Error("Failed to generate flashcards from OpenAI");
  }
};

app.post("/api/flashcards/create-and-save", authenticateToken, async (req, res) => {
  const { topic, numFlashcards } = req.body;
  const userId = req.user.id;

  if (!topic || !numFlashcards || isNaN(numFlashcards)) {
    return res.status(400).json({ error: "Invalid input. Topic and numFlashcards are required." });
  }

  try {
    // Generate flashcards using OpenAI
    const flashcards = await getFlashcardsFromOpenAI(topic, numFlashcards);

    // Save flashcards to the database
    const insertFlashcards = flashcards.map((card) =>
      pool.query(
        `INSERT INTO public.flashcards (user_id, topic, question, answer) VALUES ($1, $2, $3, $4)`,
        [userId, topic, card.front, card.back]
      )
    );

    await Promise.all(insertFlashcards);

    res.status(201).json({ message: "Flashcards created and saved successfully!", flashcards });
  } catch (error) {
    console.error("Error creating and saving flashcards:", error.message);
    res.status(500).json({ error:  error.message });
  }
});


app.post("/api/flashcards", authenticateToken, async (req, res) => {
  const { topic, flashcards } = req.body;
  const userId = req.user.id;

  console.log("Received data:", { topic, flashcards });

  if (!topic || !flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
    console.error("Invalid input:", { topic, flashcards });
    return res.status(400).json({ error: "Invalid input. Topic and flashcards are required." });
  }

  try {
    const insertFlashcards = flashcards.map((card) =>
      pool.query(
        `INSERT INTO public.flashcards (user_id, topic, question, answer) VALUES ($1, $2, $3, $4)`,
        [userId, topic, card.question, card.answer]
      )
    );

    await Promise.all(insertFlashcards);

    res.status(201).json({ message: "Flashcards saved successfully!" });
  } catch (error) {
    console.error("Error saving flashcards:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// PDF Q&A Route
app.post("/api/pdf-qa", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const question = req.body.question;

    if (!file || !question) {
      return res.status(400).json({ error: "File and question are required." });
    }

    const extractedText = await extractTextFromPDF(file.path);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Answer the question based on the following text:\n\n${extractedText}\n\nQuestion: ${question}\nAnswer:`,
        },
      ],
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error("Error processing PDF Q&A:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

// Generate Quiz Route
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;

  if (!topic || !numQuestions || !difficulty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const questions = await getQuizFromOpenAI(topic, numQuestions, difficulty);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Error generating quiz. Please try again." });
  }
});


// Fetch user progress API
app.get("/api/progress", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Calculate quiz progress
    const quizResults = await pool.query(
      `SELECT COUNT(*) AS total_quizzes,
              SUM(score) AS total_score,
              SUM(total_questions) AS total_questions
       FROM public.quizzes
       WHERE user_id = $1`,
      [userId]
    );

    const quizStats = quizResults.rows[0];
    const totalQuizzes = parseInt(quizStats.total_quizzes || 0, 10);
    const totalScore = parseInt(quizStats.total_score || 0, 10);
    const totalQuestions = parseInt(quizStats.total_questions || 0, 10);

    const quizCompletionRate = totalQuestions
      ? Math.round((totalScore / totalQuestions) * 100)
      : 0;

    // Calculate flashcard progress
    const flashcardResults = await pool.query(
      `SELECT COUNT(*) AS total_flashcards
       FROM public.flashcards
       WHERE user_id = $1`,
      [userId]
    );

    const totalFlashcards = parseInt(flashcardResults.rows[0].total_flashcards || 0, 10);

    res.status(200).json({
      totalQuizzes,
      quizCompletionRate,
      totalFlashcards,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error.message);
    res.status(500).json({ error: "Failed to fetch progress data." });
  }
});


// Generate Flashcards Route
app.post("/api/generate-flashcards", async (req, res) => {
  const { topic, numFlashcards } = req.body;

  if (!topic || !numFlashcards) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const flashcards = await getFlashcardsFromOpenAI(topic, numFlashcards);
    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({ error: "Error generating flashcards. Please try again." });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});