 import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { analyzeResume, extractTextFromPDF, generateMockText } from "./analyzer.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.json({ message: "ATS Resume Analyzer API running" });
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
    res.json({ analysis });

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Analysis failed" });
  }
});

app.post("/api/analyze-sample", async (req, res) => {
  try {
    const { jobRole } = req.body;
    const mockText = generateMockText(jobRole);
    const analysis = analyzeResume(mockText, jobRole);
    res.json({ analysis });
  } catch (error) {
    console.error("Sample analysis error:", error);
    res.status(500).json({ error: error.message || "Sample analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});