# 🤖 ATS Smart Resume Analyzer — Intelligent Resume Analyzer

A full-stack AI-powered resume analysis platform with futuristic dark UI, ATS scoring, skills gap analysis, and personalized recommendations.

---

## ✨ Features

- **PDF Upload** — Drag-and-drop or click-to-browse PDF resume upload
- **ATS Score (0-100)** — Animated score ring with detailed breakdown
- **Skills Extraction** — Detects 70+ industry skills across 8 categories
- **Skills Gap Analysis** — Identifies missing skills for your target role
- **Section Analysis** — Evaluates Contact, Experience, Education, Skills, Projects, Summary, Achievements
- **Job Role Matching** — Tailored scoring for 10+ roles (Software Engineer, Data Scientist, DevOps, etc.)
- **Recommendations** — Critical, moderate, and tip-level improvement suggestions
- **Animated Charts** — Radar chart, bar chart, animated progress bars
- **Sample Resume Testing** — Try the analyzer without uploading a file
- **Fully Responsive** — Mobile-first design

---

## 🗂 Folder Structure

```
resume-analyzer/
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScoreRing.jsx     # Animated SVG score ring
│   │   │   └── ProgressBar.jsx   # Animated progress bars
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── UploadPage.jsx    # Drag-and-drop upload
│   │   │   ├── DashboardPage.jsx # Full analysis dashboard
│   │   │   └── AboutPage.jsx
│   │   ├── hooks/
│   │   │   └── useAnalysis.jsx   # Global analysis state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Futuristic design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                   # Node.js + Express
    ├── server.js              # API routes
    ├── analyzer.js            # Resume analysis engine
    └── package.json
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Backend Setup

```bash
cd backend
npm install
node server.js
# Server starts at http://localhost:3001
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

### 3. Build for Production

```bash
cd frontend
npm run build
# Builds to frontend/dist/
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload PDF + jobRole, returns analysis |
| POST | `/api/analyze-sample` | Analyze a built-in sample resume |
| GET | `/api/health` | Health check |

### Request: `/api/analyze`
```
Content-Type: multipart/form-data
Fields: resume (file), jobRole (string)
```

### Response
```json
{
  "success": true,
  "analysis": {
    "atsScore": 74,
    "atsBreakdown": { "contact": 8, "sections": 14, "skills": 24, "jobMatch": 19, "quality": 9 },
    "sections": [...],
    "skills": [...],
    "topSkills": ["javascript", "react", "node.js"],
    "suggestedSkills": ["typescript", "docker", "aws"],
    "recommendations": [...],
    "stats": { "wordCount": 320, "skillsFound": 12, ... }
  }
}
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| File Upload | React Dropzone |
| Backend | Node.js + Express |
| PDF Parsing | pdf-parse |
| Fonts | Orbitron (headings) + Inter (body) + JetBrains Mono |

---

## 🎯 Supported Job Roles

- Software Engineer
- Frontend Developer
- Backend Developer  
- Full Stack Developer
- Data Scientist
- ML Engineer
- DevOps Engineer
- Product Manager
- UX Designer
- Mobile Developer

---

## 🔒 Privacy

Resumes are processed **in memory only** — no files are saved to disk and no data is retained after the response is sent.
