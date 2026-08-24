export const contact = {
  email: "theayushiananta@gmail.com",
  linkedin: "https://linkedin.com/in/ayushi-ananta",
  github: "https://github.com/AyushiAnanta",
  resume: "https://drive.google.com/file/d/1hVeJ5WhZZ_t21krzsaiQT3oGbOWaJTrw/view?usp=sharing",
};

export const hero = {
  greeting: "hey, it's",
  name: "Ayushi Ananta",
  hindiName: "आयुषी अनंता",
  tagline: "I make software that actually does something.",
  sub: "Full Stack Dev · AI Builder · Probably debugging right now",
};

export const about = {
  bio: " 4th-year CS undergrad (AI specialization), CyberForHer National Finalist out of 700+ applicants. I build systems that ship — a multilingual grievance platform serving five Indian languages, a RAG pipeline with hand-evaluated retrieval accuracy, an LLM detective game, and Voldy's Diary, an AI-backed whiteboard app built from the canvas rendering layer up. I like projects that do something.",
};

export const projects = [
  {
    name: "docs.",
    subtitle: "Full-Stack Document Platform with RAG Search",
    desc: "A document platform with a hybrid dense + keyword retrieval pipeline, custom inline-citation editor experience, and a structure-aware import pipeline for messy real-world files like PDFs.",
    bullets: [
      "Custom TipTap node extension for inline citations — custom schema, hover-preview NodeView, and deep-link navigation that scrolls to and highlights the cited section.",
      "Hybrid search pipeline combining dense vector search (3,072-dim Gemini embeddings) and full-text keyword search via Reciprocal Rank Fusion over MongoDB Atlas.",
      "Built a PDF/DOCX import pipeline that reconstructs document structure (headings, paragraphs, alignment) from raw PDF text using font-size statistical analysis and spatial clustering, then chunks on heading boundaries and selectively re-embeds only changed sections via SHA-256 hash diffing.",
      "Built a 14-question evaluation harness to benchmark retrieval quality — 78.6% top-1 and 100% top-5 accuracy — used to validate the hybrid RRF pipeline against dense-only retrieval.",
      "Resolved cross-origin auth failures between the Vercel frontend and Render backend by hardening cookie and CORS configuration.",
    ],
    tags: ["MERN", "TipTap", "MongoDB Atlas Vector Search", "Groq", "Gemini"],
    github: "https://github.com/AyushiAnanta/docs",
    demo: "https://docs-app-weld.vercel.app/",
  },
  {
    name: "Voldy's Diary",
    subtitle: "AI-Powered Infinite Whiteboard",
    desc: "An Excalidraw-style infinite canvas whiteboard with an AI backend, built for real-time drawing at scale with an emphasis on catching the gap between what an AI coding agent claims is done and what the code actually does.",
    bullets: [
      "Engineered a real-time canvas engine handling stroke smoothing, hit-testing, and eraser point-splitting across thousands of coordinates on a 20,000×20,000 unit canvas.",
      "Replaced a vulnerable eval()-based math evaluator with a custom recursive-descent parser, closing an RCE hole and passing a 14-case automated security and edge-case test suite.",
      "Designed a 2-tier IndexedDB recovery system that compacts stroke history from 500 to 300 records on storage overflow, preventing data loss.",
      "Implemented automatic AI fallback across 3 models (Gemini → 2 OpenRouter models), which kept the app running through live Gemini API outages.",
      "Consolidated the UI/backend surface for shippability: reduced themes 4→2 (arcane/studio) and reasoning tiers 5→2 (normal/deep) with backward-compatible normalization for existing saved boards.",
      "Building out an Excalidraw-parity toolset (10-tool toolbar, shape rendering, selection/resize/rotate handles, arrow edge-projection snapping) — caught and fixed canvas smearing, arrow center-snapping vs. true perimeter edge projection, eraser painting instead of deleting, and text tool stamping placeholder strings.",
    ],
    tags: ["React", "Vite", "Node/Express", "Gemini API", "OpenRouter"],
    github: "https://github.com/AyushiAnanta/Voldys-Diary",
    demo: "https://voldy-s-diary-q6gj.vercel.app/",
  },
  {
    name: "Sahayak",
    subtitle: "Multimodal Civic Grievance Platform",
    desc: "Civic grievance platform that accepts text, voice, image, and PDF inputs and auto-routes structured complaints — built for multilingual accessibility across 5 Indian languages.",
    bullets: [
      "Multimodal AI pipeline (text, voice, image, PDF) → structured, auto-routed grievance records.",
      "Tesseract OCR + LLaMA via Groq for grievance classification by type, urgency, and language across 5 Indian languages.",
      "Validated across 50+ test cases spanning all input modalities."
    ],
    tags: ["FastAPI", "MERN", "Groq API", "Tesseract OCR", "LLaMA"],
    github: "https://github.com/AyushiAnanta/Sahayak",
    demo: "https://sahayak-pink.vercel.app/",
  },
  {
    name: "AI Imposter",
    subtitle: "LLM-Powered Detective Game",
    desc: "Browser-based detective game where you interrogate AI suspects — each with persistent memory and a unique backstory generated fresh every session.",
    bullets: [
      "Cut AI response time by ~92% by migrating suspect-response generation to async FastAPI calls.",
      "Per-session story + chat history via Gemini API keeps characters consistent across multi-round interrogations.",
      "Deployed on Vercel with graceful handling of edge-case player inputs."
    ],
    tags: ["MERN", "Gemini API", "FastAPI", "Vercel"],
    github: "https://github.com/AyushiAnanta/AI-Imposter",
    demo: "https://a-imposter.vercel.app/",
  },
  {
    name: "oopsTube",
    subtitle: "Full-Stack Video Streaming Platform",
    desc: "YouTube-like platform with video uploads up to 20 min, adaptive playback, JWT auth, and real-time interactions.",
    bullets: [
      "25+ REST endpoints across controllers, routes, and middleware.",
      "Cloudinary-powered uploads with adaptive streaming and JWT-based sessions."
    ],
    tags: ["MERN", "JWT", "Cloudinary", "Express.js", "Node.js"],
    github: "https://github.com/AyushiAnanta/oopsTube",
    demo: "https://oops-tube.vercel.app/",
  },
];

export const skills = {
  Frontend: ["React.js", "Tailwind CSS", "JavaScript (ES6+)", "HTML/CSS", "TipTap/ProseMirror"],
  Backend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "MongoDB"],
  "AI/ML & NLP": ["Tesseract OCR", "Groq API", "Gemini API", "Hugging Face", "PyTorch", "Scikit-learn", "RAG / Hybrid Retrieval"],
  Languages: ["Python", "JavaScript", "Java", "SQL"],
  Tools: ["Git", "Cloudinary", "Jupyter Notebook", "VS Code", "Antigravity (AI coding agent)"],
};

export const experience = [
  {
    role: "Web Development Intern",
    company: "STAC (Microsoft-funded EdTech startup)",
    duration: "Aug. 2024 – Nov. 2024",
    type: "Part-time, Remote",
    bullets: [
      "Designed and shipped 10+ React and Tailwind CSS features including navbar and card components, resolving critical mobile responsiveness issues that reduced observed page load time from 8–9s to 2–3s post-deployment.",
      "Refactored frontend codebase from unstructured to modular component architecture, eliminating redundant rendering patterns and achieving clean user feedback with no further UI complaints after release."
    ]
  },
  {
    role: "Teaching Assistant — Python Programming",
    company: "NIIT University, Neemrana",
    duration: "Aug. 2024 – Dec. 2024",
    type: "On-site",
    bullets: [
      "Ran weekly Python/DSA lab sessions for 100+ students, using session data to identify 13–15 at-risk students for targeted 1-on-1 mentoring — driving a 100% pass rate in my cohort against a 5–10% class-wide failure rate."
    ]
  }
];

export const education = [
  {
    degree: "B.Tech in Computer Science",
    institution: "NIIT University",
    duration: "2023 – 2027 (Expected)",
    grade: "CGPA: 9.88",
  },
  {
    degree: "Class XII (CBSE)",
    institution: "St. Michael's High School, Patna",
    duration: "2023",
    grade: "95%",
  },
  {
    degree: "Class X (CBSE)",
    institution: "St. Michael's High School, Patna",
    duration: "2021",
    grade: "98%",
  },
];

export const achievements = [
  {
    title: "CyberForHer Hackathon (EY & DSCI)",
    desc: "National Finalist; selected from 700+ applicants nationwide.",
    year: "2024",
  },
  {
    title: "Hult Prize India",
    desc: "Nationals Qualifier.",
    year: "2024",
  },
  {
    title: "Debating Society (Debsoc NU)",
    desc: "Student Coordinator; represented university in intercollegiate competitions.",
    year: "2023 – Present",
  },
  {
    title: "Binary Beast Coding Club",
    desc: "Active Member.",
    year: "2023 – Present",
  },
];

// Arcade games information
export const arcadeGames = [
  {
    id: "hangman",
    name: "Hangman",
    desc: "Guess the mystery word before you run out of lives",
    image: "/arcade/hangman.png",
    color: "#ffdd00",
    genre: "WORD / PUZZLE",
    difficulty: "EASY",
    badge: "1P",
    tag: "RETRO 8-BIT",
    play: "https://ayushiananta.github.io/hangman/",
    github: "https://github.com/AyushiAnanta/hangman",
  },
  {
    id: "tictactoe",
    name: "TicTacToe",
    desc: "Classic X vs O duel — claim lines & conquer the grid",
    image: "/arcade/tictactoe.jpg",
    color: "#bf5fff",
    genre: "STRATEGY",
    difficulty: "MEDIUM",
    badge: "2P",
    tag: "VERSUS MODE",
    play: "https://ayushiananta.github.io/tictactoe/",
    github: "https://github.com/AyushiAnanta/tictactoe",
  },
  {
    id: "bubblegame",
    name: "BubbleGame",
    desc: "Fast reflex challenge — pop target bubbles against the clock",
    image: "/arcade/bubblegame.jpg",
    color: "#39ff14",
    genre: "REFLEX / SPEED",
    difficulty: "HARD",
    badge: "1P",
    tag: "HIGH SCORE",
    play: "https://ayushiananta.github.io/BubbleGame/",
    github: "https://github.com/AyushiAnanta/BubbleGame",
  },
  {
    id: "brainypairs",
    name: "BrainyPairs",
    desc: "Matrix card memory — match all pairs before time expires",
    image: "/arcade/brainypairs.jpg",
    color: "#00f0ff",
    genre: "MEMORY MATRIX",
    difficulty: "MEDIUM",
    badge: "1P",
    tag: "PUZZLE",
    play: "https://ayushiananta.github.io/brainypairs/",
    github: "https://github.com/AyushiAnanta/brainypairs",
  },
];