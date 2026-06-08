import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResume, extractTextFromPDF } from "./analyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Resume-Analyzer Backend is Live ✅");
  });

  const storage = multer.memoryStorage();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const jobRole = req.body.jobRole || "Software Engineer";

    let extractedText = "";
    try {
      extractedText = await extractTextFromPDF(pdfBuffer);
    } catch (err) {
      console.log("PDF parse failed, using mock text:", err.message);
      extractedText = "";
    }

    const analysis = analyzeResume(extractedText, jobRole);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Analysis failed" });
  }
});

app.post("/api/analyze-sample", async (req, res) => {
  try {
    const { jobRole = "Software Engineer" } = req.body;
    const sampleText = getSampleResumeText(jobRole);
    const analysis = analyzeResume(sampleText, jobRole);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getSampleResumeText(jobRole) {
  const samples = {
    "Software Engineer": `John Doe | johndoe@email.com | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe
    
EXPERIENCE
Senior Software Engineer - TechCorp (2021-Present)
- Built scalable microservices using Node.js and Docker
- Led team of 5 engineers on React frontend migration
- Optimized PostgreSQL queries reducing load time by 40%

Software Engineer - StartupXYZ (2019-2021)
- Developed REST APIs using Python/Flask
- Implemented CI/CD pipelines with Jenkins

EDUCATION
B.S. Computer Science - State University (2019)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git, Docker, AWS, REST APIs

PROJECTS
E-commerce Platform: Built full-stack app with React, Node.js, MongoDB`,

    "Data Scientist": `Jane Smith | jane@email.com | Portfolio: janesmith.io
    
EXPERIENCE
Data Scientist - Analytics Co (2020-Present)
- Built ML models using Python, scikit-learn, TensorFlow
- Analyzed datasets of 10M+ records using Pandas, NumPy
- Created dashboards in Tableau and Power BI

EDUCATION
M.S. Data Science - Tech University (2020)
B.S. Statistics - State College (2018)

SKILLS
Python, R, SQL, Machine Learning, TensorFlow, PyTorch, Pandas, Tableau

CERTIFICATIONS
AWS Certified Machine Learning Specialty`,
  };
  return samples[jobRole] || samples["Software Engineer"];
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
