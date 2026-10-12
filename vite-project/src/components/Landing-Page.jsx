import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  Clock3,
  FileQuestion,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Styles/Landing-Page.css";

const features = [
  {
    number: "01",
    icon: BrainCircuit,
    title: "Quizzes that meet you where you are.",
    description:
      "Turn a topic into a focused practice session. Choose your difficulty, test what sticks, and learn from every answer.",
    label: "AI QUIZ BUILDER",
    className: "feature-card--quiz",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Make recall your superpower.",
    description:
      "Build a deck around any subject, then flip through bite-sized prompts designed to make the important details stay.",
    label: "SMART FLASHCARDS",
    className: "feature-card--cards",
  },
  {
    number: "03",
    icon: FileQuestion,
    title: "Your notes, with answers.",
    description:
      "Ask questions about your own PDFs and get clear, relevant answers grounded in the material you uploaded.",
    label: "PDF QUESTION & ANSWER",
    className: "feature-card--pdf",
  },
  {
    number: "04",
    icon: Target,
    title: "Know what to work on next.",
    description:
      "See your practice history and progress in one place, so your next study session starts with a little more direction.",
    label: "PROGRESS TRACKER",
    className: "feature-card--progress",
  },
];

const steps = [
  {
    number: "01",
    title: "Bring what you’re learning",
    description: "Start with a subject, a question, or the notes you already have.",
  },
  {
    number: "02",
    title: "Choose your way to practice",
    description: "Generate a quiz, make flashcards, or ask your PDF a question.",
  },
  {
    number: "03",
    title: "Build confidence, one session at a time",
    description: "Learn from each answer and use your progress to keep moving.",
  },
];

function StudyPreview() {
  return (
    <div className="study-visual" role="img" aria-label="Preview of a SmartPrep practice quiz">
      <div className="visual-orbit visual-orbit--one" />
      <div className="visual-orbit visual-orbit--two" />
      <div className="visual-spark visual-spark--one" />
      <div className="visual-spark visual-spark--two" />
      <div className="visual-note">
        <span className="visual-note__icon"><Layers3 size={15} /></span>
        <span>Flashcard deck</span>
        <strong>Cell biology</strong>
      </div>
      <div className="quiz-window">
        <div className="quiz-window__top">
          <div className="quiz-window__brand">
            <span className="brand-mark brand-mark--small"><Sparkles size={13} /></span>
            <span>smartprep</span>
          </div>
          <span className="quiz-window__status"><span /> IN SESSION</span>
        </div>
        <div className="quiz-window__body">
          <div className="quiz-meta">
            <span>QUICK PRACTICE</span>
            <span>04 <i>/ 10</i></span>
          </div>
          <div className="quiz-progress"><span /></div>
          <h2>What is the main role of mitochondria?</h2>
          <div className="quiz-answer quiz-answer--selected">
            <span className="answer-letter">A</span>
            <span>Produce energy for the cell</span>
            <Check size={15} />
          </div>
          <div className="quiz-answer">
            <span className="answer-letter">B</span>
            <span>Store genetic information</span>
          </div>
          <div className="quiz-answer quiz-answer--muted">
            <span className="answer-letter">C</span>
            <span>Make proteins for the cell</span>
          </div>
        </div>
        <div className="quiz-window__bottom">
          <span><Clock3 size={13} /> Keep your momentum</span>
          <span className="quiz-next"><ArrowRight size={15} /></span>
        </div>
      </div>
      <div className="visual-insight">
        <span className="visual-insight__icon"><Sparkles size={14} /></span>
        <div><span>Nice work</span><strong>That’s the right answer</strong></div>
      </div>
      <div className="visual-caption"><span /> YOUR NEXT STUDY SESSION, SORTED</div>
    </div>
  );
}

function renderFeatureArtwork(feature) {
  const Icon = feature.icon;

  if (feature.className === "feature-card--quiz") {
    return (
      <div className="feature-art feature-art--quiz" aria-hidden="true">
        <div className="art-quiz">
          <div className="art-quiz__line"><span /><span /></div>
          <strong>What do you want to<br />understand today?</strong>
          <div className="art-quiz__chips"><span>Biology</span><span>Medium</span><span>10 questions</span></div>
          <div className="art-quiz__button"><Sparkles size={13} /> Build my quiz <ArrowRight size={13} /></div>
        </div>
        <span className="art-sticker"><Icon size={18} /></span>
      </div>
    );
  }

  if (feature.className === "feature-card--cards") {
    return (
      <div className="feature-art feature-art--cards" aria-hidden="true">
        <div className="art-flashcard art-flashcard--back">CELL<br />BIOLOGY</div>
        <div className="art-flashcard art-flashcard--front">
          <span>QUICK RECALL <ArrowUpRight size={13} /></span>
          <strong>What powers<br />the cell?</strong>
          <i><Sparkles size={14} /></i>
        </div>
        <span className="art-card-count">04 <small>/ 12</small></span>
      </div>
    );
  }

  if (feature.className === "feature-card--pdf") {
    return (
      <div className="feature-art feature-art--pdf" aria-hidden="true">
        <div className="art-document">
          <span className="art-document__icon"><FileQuestion size={15} /></span>
          <div><strong>Biology_Chapter_04.pdf</strong><small>24 pages · Ready to explore</small></div>
          <Check size={15} />
        </div>
        <div className="art-question"><span>YOU ASKED</span><p>Can you explain cellular respiration?</p></div>
        <div className="art-answer"><span><Sparkles size={12} /> SMARTPREP</span><i /><i /><i /></div>
      </div>
    );
  }

  return (
    <div className="feature-art feature-art--progress" aria-hidden="true">
      <div className="art-progress__heading"><span>THIS WEEK</span><strong>Keep it up <Sparkles size={14} /></strong></div>
      <div className="art-chart">
        <div className="art-chart__axis"><span>100</span><span>50</span><span>0</span></div>
        <div className="art-chart__bars">
          {[38, 54, 44, 74, 61, 88, 77].map((height, index) => (
            <span key={index} style={{ "--bar-height": `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="art-progress__footer"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="SmartPrep AI home">
          <span className="brand-mark"><Sparkles size={15} strokeWidth={2.4} /></span>
          <span>smartprep<span className="wordmark__ai">.ai</span></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#features">What you can do</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/auth" className="nav-cta">Get started <ArrowUpRight size={15} /></Link>
        </nav>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-backdrop" aria-hidden="true">
          <div className="hero-backdrop__glow" />
          <div className="hero-backdrop__grid" />
          <span className="hero-coordinate">40° 43′ 55.3″ N &nbsp;·&nbsp; YOUR NEXT BIG IDEA</span>
        </div>
        <div className="hero-copy">
          <div className="eyebrow eyebrow--hero"><span className="eyebrow__star"><Sparkles size={12} /></span> A clearer way to study</div>
          <h1 id="hero-title">Make room<br />for your <span>aha.</span></h1>
          <p className="hero-description">
            Turn big topics into small, focused wins. Quizzes, flashcards, and your own notes—one thoughtful study space.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="button button--light">Start learning free <ArrowUpRight size={17} /></Link>
            <a className="text-link text-link--hero" href="#features">Explore SmartPrep <ArrowDown size={15} /></a>
          </div>
          <div className="hero-footnote"><span className="hero-footnote__avatars"><i>S</i><i>P</i><i>A</i></span><span>Made for curious minds<br /><strong>and every kind of learner</strong></span></div>
        </div>
        <StudyPreview />
        <div className="hero-index"><span>01</span><i /> A BETTER WAY FORWARD</div>
      </section>

      <div className="tool-ribbon" aria-label="Study tools">
        <div className="tool-ribbon__intro">ONE SPACE.<br /><strong>EVERY STUDY MODE.</strong></div>
        <div className="tool-ribbon__item"><BrainCircuit size={17} /><span>AI quizzes</span></div>
        <div className="tool-ribbon__item"><Layers3 size={17} /><span>Smart flashcards</span></div>
        <div className="tool-ribbon__item"><FileQuestion size={17} /><span>PDF Q&amp;A</span></div>
        <div className="tool-ribbon__item"><Target size={17} /><span>Progress insights</span></div>
      </div>

      <section className="features-section" id="features" aria-labelledby="features-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow__star"><Sparkles size={12} /></span> Your study toolkit</div>
            <h2 id="features-title">Less rereading.<br /><span>More getting it.</span></h2>
          </div>
          <p>Meet your ideas where they are—and find the way of learning that makes them click.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className={`feature-card ${feature.className}`} key={feature.number}>
                <div className="feature-card__top">
                  <span className="feature-card__number">{feature.number} / 04</span>
                  <span className="feature-card__icon"><Icon size={18} strokeWidth={1.8} /></span>
                </div>
                {renderFeatureArtwork(feature)}
                <div className="feature-card__copy">
                  <span className="feature-label">{feature.label}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <span className="feature-card__arrow"><ArrowUpRight size={17} /></span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="method-section" id="how-it-works" aria-labelledby="method-title">
        <div className="method-heading">
          <div className="eyebrow eyebrow--light"><span className="eyebrow__star"><Sparkles size={12} /></span> Simple by design</div>
          <h2 id="method-title">A little more<br /><span>you’ve got this.</span></h2>
          <p>Start where you are. SmartPrep helps you turn studying into steady progress.</p>
          <Link to="/auth" className="text-link text-link--light">Find your flow <ArrowRight size={16} /></Link>
          <div className="method-decoration" aria-hidden="true"><BookOpenCheck size={140} strokeWidth={0.65} /></div>
        </div>
        <div className="method-steps">
          {steps.map((step) => (
            <article className="method-step" key={step.number}>
              <span className="method-step__number">{step.number}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
              <ArrowUpRight className="method-step__arrow" size={18} />
            </article>
          ))}
          <div className="method-note"><span><Check size={13} /></span> A more focused study session is closer than you think.</div>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-decoration" aria-hidden="true"><span>SP</span><i /><i /><i /></div>
        <div className="eyebrow"><span className="eyebrow__star"><Sparkles size={12} /></span> Your next chapter starts here</div>
        <h2>Big goals.<br /><span>Small, doable steps.</span></h2>
        <p>Show up curious. We’ll help you figure out what to focus on next.</p>
        <Link to="/auth" className="button button--dark">Make your first move <ArrowUpRight size={17} /></Link>
        <span className="closing-caption">SMART STUDYING STARTS WITH ONE QUESTION</span>
      </section>

      <footer className="site-footer">
        <Link to="/" className="wordmark wordmark--footer">
          <span className="brand-mark"><Sparkles size={14} strokeWidth={2.4} /></span>
          <span>smartprep<span className="wordmark__ai">.ai</span></span>
        </Link>
        <span className="footer-note">A little more clarity for your next big thing.</span>
        <div className="footer-links"><a href="#features">Explore</a><Link to="/auth">Sign in <ArrowUpRight size={13} /></Link></div>
        <span className="footer-copyright">© {new Date().getFullYear()} SmartPrep AI</span>
      </footer>
    </main>
  );
}
