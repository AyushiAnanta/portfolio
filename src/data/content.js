export const contact = {
  phone: "+91 63782 06977",
  email: "theayushiananta@gmail.com",
  linkedin: "https://linkedin.com/in/ayushi-ananta",
  github: "https://github.com/AyushiAnanta",
};

export const hero = {
  greeting: "Hey, I'm",
  name: "Ayushi Ananta",
  hindiName: "आयुषी अनंता",
  tagline: "I build things that think.",
  sub: "Full Stack Developer & AI Builder",
};

export const about = {
  bio: "I'm a CS undergrad at NIIT University (CGPA 9.93) obsessed with building products at the intersection of web and AI. From multilingual grievance platforms to LLM-powered detective games — I like my projects to actually do something. National finalist at CyberForHer (EY & DSCI), selected from 700+ applicants.",
};

export const projects = [
  {
    name: "Sahayak",
    subtitle: "Multimodal Civic Grievance Platform",
    desc: "Architected an end-to-end multimodal AI processing pipeline ingesting text, voice, image, and PDF inputs, outputting structured and automatically routed grievance records.",
    bullets: [
      "Architected an end-to-end multimodal AI processing pipeline ingesting text, voice, image, and PDF inputs and outputting structured, routable grievance records — validated across 50+ test cases spanning all input modalities.",
      "Integrated Tesseract OCR with a Groq-hosted LLaMA model to classify grievances by type, urgency, and language across 5 Indian languages, enabling access for users across language barriers.",
      "Designed FastAPI backend to handle concurrent multimodal requests, structuring the system for production-readiness ahead of planned deployment."
    ],
    tags: ["FastAPI", "MERN", "Groq API", "Tesseract OCR", "LLaMA"],
    github: "https://github.com/AyushiAnanta/Sahayak", // placeholder or actual
    demo: "",
  },
  {
    name: "AI Imposter",
    subtitle: "LLM-Powered Detective Game",
    desc: "A browser-based interrogative detective game where players question AI-driven suspects using persistent, session-level memory state.",
    bullets: [
      "Reduced AI response latency by ~92% — from 60s to ~5s — by migrating from synchronous API calls to a FastAPI backend, making real-time gameplay viable for the first time.",
      "Engineered per-session story generation using Gemini API with persistent chat history, ensuring character consistency and narrative coherence across multi-round interrogations without drift.",
      "Deployed a browser-based detective game on Vercel with dynamic AI-driven characters, handling edge-case player inputs gracefully within an immersive game loop."
    ],
    tags: ["MERN", "Gemini API", "FastAPI", "Vercel"],
    github: "https://github.com/AyushiAnanta/AI-Imposter",
    demo: "https://ai-imposter-demo.vercel.app", // placeholder/hypothetical
  },
  {
    name: "oopsTube",
    subtitle: "Full-Stack Video Streaming Platform",
    desc: "A robust media-sharing and streaming application with custom video adapters, JWT-based sessions, and secure image and video content management.",
    bullets: [
      "Architected a RESTful Node.js/Express backend with 25+ fully tested and documented endpoints, separated across controllers, routes, and middleware layers for maintainability at scale.",
      "Built full-stack video streaming with Cloudinary-powered uploads supporting 15–20 min videos, adaptive playback, JWT authentication, and real-time user interactions."
    ],
    tags: ["MERN", "JWT", "Cloudinary", "Express.js", "Node.js"],
    github: "https://github.com/AyushiAnanta/oopsTube",
    demo: "https://oopstube-demo.vercel.app",
  },
];

export const skills = {
  Frontend: ["React.js", "Tailwind CSS", "JavaScript (ES6+)", "HTML/CSS"],
  Backend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "MongoDB"],
  "AI/ML & NLP": ["Tesseract OCR", "Groq API", "Gemini API", "Hugging Face", "PyTorch", "Scikit-learn"],
  Languages: ["Python", "JavaScript", "Java", "SQL"],
  Tools: ["Git", "Cloudinary", "Jupyter Notebook", "VS Code"],
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
      "Delivered 20+ lab sessions to 100+ first-year students covering Python, data structures, and algorithmic problem-solving across Jupyter Notebook environments.",
      "Identified and personally mentored 13–15 at-risk and late-joining students through targeted 1-on-1 debugging and concept sessions, achieving a 100% pass rate within my cohort against a 5–10% class-wide failure rate."
    ]
  }
];

export const education = [
  {
    degree: "B.Tech in Computer Science",
    institution: "NIIT University",
    duration: "2023 – 2027 (Expected)",
    grade: "CGPA: 9.93/10",
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
    desc: "National Finalist.",
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
    name: "tictactoe",
    desc: "Interactive classic tic-tac-toe grid game",
    tag: "CSS",
    color: "#bf5fff",
    github: "https://github.com/AyushiAnanta/tictactoe",
    play: "https://ayushiananta.github.io/tictactoe/",
    image: "/arcade/tictactoe.jpg"
  },
  {
    name: "BubbleGame",
    desc: "Catch the matching numbers bubble popping game",
    tag: "JS",
    color: "#39ff14",
    github: "https://github.com/AyushiAnanta/BubbleGame",
    play: "https://ayushiananta.github.io/BubbleGame/",
    image: "/arcade/bubblegame.jpg"
  },
  {
    name: "brainypairs",
    desc: "Memory match card game testing pairs matching speed",
    tag: "JS",
    color: "#00f0ff",
    github: "https://github.com/AyushiAnanta/brainypairs",
    play: "https://ayushiananta.github.io/brainypairs/",
    image: "/arcade/brainypairs.jpg"
  },
  {
    name: "hangman",
    desc: "Retro hangman word guessing challenge",
    tag: "JS",
    color: "#ffdd00",
    github: "https://github.com/AyushiAnanta/hangman",
    play: "https://ayushiananta.github.io/hangman/",
    image: "/arcade/hangman.png"
  }
];