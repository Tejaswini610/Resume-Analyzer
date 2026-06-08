import pdfParse from "pdf-parse";

export async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

const SKILL_CATEGORIES = {
  "Programming Languages": {
    keywords: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin", "scala", "r"],
    weight: 15,
  },
  "Frontend": {
    keywords: ["react", "vue", "angular", "nextjs", "svelte", "html", "css", "tailwind", "bootstrap", "webpack", "vite", "redux", "graphql"],
    weight: 12,
  },
  "Backend": {
    keywords: ["node.js", "nodejs", "express", "django", "flask", "spring", "fastapi", "laravel", "rails", "asp.net", "rest api", "microservices"],
    weight: 12,
  },
  "Databases": {
    keywords: ["sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "firebase", "sqlite", "dynamodb", "cassandra"],
    weight: 10,
  },
  "Cloud & DevOps": {
    keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "terraform", "ansible", "linux", "nginx"],
    weight: 12,
  },
  "Data Science & ML": {
    keywords: ["machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn", "data analysis", "nlp", "computer vision"],
    weight: 10,
  },
  "Tools & Practices": {
    keywords: ["git", "github", "jira", "agile", "scrum", "tdd", "testing", "jest", "selenium", "figma", "postman"],
    weight: 8,
  },
  "Soft Skills": {
    keywords: ["leadership", "communication", "teamwork", "problem solving", "mentoring", "collaboration", "project management", "critical thinking"],
    weight: 8,
  },
};

const SECTION_PATTERNS = {
  contact: /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)|(linkedin\.com|github\.com|\+\d{10,})/gi,
  experience: /(experience|work history|employment|career|professional background)/i,
  education: /(education|degree|university|college|bachelor|master|phd|certification)/i,
  skills: /(skills|technologies|tech stack|expertise|competencies|proficiencies)/i,
  projects: /(projects|portfolio|work samples|case studies)/i,
  summary: /(summary|objective|profile|about me|overview)/i,
  achievements: /(achievements|accomplishments|awards|honors|recognition)/i,
};

const JOB_ROLE_REQUIREMENTS = {
  "Software Engineer": {
    must: ["javascript", "git", "rest api", "sql", "testing"],
    preferred: ["react", "node.js", "docker", "aws", "typescript"],
    bonus: ["kubernetes", "ci/cd", "microservices", "graphql"],
  },
  "Data Scientist": {
    must: ["python", "machine learning", "sql", "pandas", "statistics"],
    preferred: ["tensorflow", "pytorch", "numpy", "scikit-learn", "tableau"],
    bonus: ["deep learning", "nlp", "spark", "aws", "r"],
  },
  "Frontend Developer": {
    must: ["javascript", "react", "html", "css", "git"],
    preferred: ["typescript", "vue", "tailwind", "webpack", "testing"],
    bonus: ["nextjs", "graphql", "redux", "figma", "performance optimization"],
  },
  "DevOps Engineer": {
    must: ["linux", "docker", "ci/cd", "git", "aws"],
    preferred: ["kubernetes", "terraform", "ansible", "jenkins", "monitoring"],
    bonus: ["python", "bash", "nginx", "security", "cloud architecture"],
  },
  "Backend Developer": {
    must: ["node.js", "sql", "rest api", "git", "testing"],
    preferred: ["python", "docker", "postgresql", "redis", "microservices"],
    bonus: ["kubernetes", "aws", "message queues", "grpc", "elasticsearch"],
  },
};

function detectSections(text) {
  const lowerText = text.toLowerCase();
  const sections = {};

  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    sections[section] = {
      found: pattern.test(lowerText),
      strength: "weak",
    };
  }

  // Estimate section quality by content length around keywords
  const lines = text.split("\n").filter((l) => l.trim());
  sections.contact.strength = sections.contact.found ? (text.match(SECTION_PATTERNS.contact) || []).length >= 2 ? "strong" : "moderate" : "weak";
  sections.experience.strength = lines.length > 15 ? "strong" : lines.length > 8 ? "moderate" : "weak";
  sections.education.strength = sections.education.found ? "strong" : "weak";
  sections.skills.strength = sections.skills.found ? "strong" : "moderate";
  sections.projects.strength = sections.projects.found ? "moderate" : "weak";
  sections.summary.strength = sections.summary.found ? "strong" : "weak";

  return sections;
}

function extractSkills(text) {
  const lowerText = text.toLowerCase();
  const foundSkills = {};
  const allFound = [];
  const allMissing = [];

  for (const [category, data] of Object.entries(SKILL_CATEGORIES)) {
    const found = data.keywords.filter((kw) => lowerText.includes(kw));
    const missing = data.keywords.filter((kw) => !lowerText.includes(kw)).slice(0, 4);
    foundSkills[category] = { found, missing, coverage: found.length / data.keywords.length };
    allFound.push(...found);
    allMissing.push(...missing.slice(0, 2));
  }

  return { byCategory: foundSkills, allFound, suggestions: [...new Set(allMissing)].slice(0, 12) };
}

function calculateATSScore(text, jobRole, sections, skillData) {
  let score = 0;
  const breakdown = {};

  // Contact info (10 pts)
  const contactMatches = (text.match(SECTION_PATTERNS.contact) || []).length;
  breakdown.contact = Math.min(10, contactMatches * 4);
  score += breakdown.contact;

  // Sections present (20 pts)
  const sectionCount = Object.values(sections).filter((s) => s.found).length;
  breakdown.sections = Math.min(20, sectionCount * 3.5);
  score += breakdown.sections;

  // Skills match (30 pts)
  const totalSkillsFound = Object.values(skillData.byCategory).reduce((a, c) => a + c.found.length, 0);
  breakdown.skills = Math.min(30, totalSkillsFound * 1.2);
  score += breakdown.skills;

  // Job role match (25 pts)
  const requirements = JOB_ROLE_REQUIREMENTS[jobRole] || JOB_ROLE_REQUIREMENTS["Software Engineer"];
  const lowerText = text.toLowerCase();
  const mustHave = requirements.must.filter((r) => lowerText.includes(r)).length;
  const preferred = requirements.preferred.filter((r) => lowerText.includes(r)).length;
  const bonus = requirements.bonus.filter((r) => lowerText.includes(r)).length;
  breakdown.jobMatch = Math.min(25, mustHave * 4 + preferred * 2 + bonus * 1);
  score += breakdown.jobMatch;

  // Content quality (15 pts)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasMetrics = /\d+%|\$[\d,]+|\d+\+\s*(years|engineers|users|customers)/i.test(text);
  const hasActionVerbs = /(built|led|developed|designed|implemented|optimized|reduced|increased|managed)/i.test(text);
  breakdown.quality = Math.min(15, (wordCount > 200 ? 5 : 2) + (hasMetrics ? 5 : 0) + (hasActionVerbs ? 5 : 0));
  score += breakdown.quality;

  return { total: Math.round(Math.min(100, score)), breakdown };
}

function generateRecommendations(sections, skillData, atsScore, jobRole) {
  const recommendations = [];
  const requirements = JOB_ROLE_REQUIREMENTS[jobRole] || JOB_ROLE_REQUIREMENTS["Software Engineer"];

  if (!sections.summary.found) {
    recommendations.push({ type: "critical", icon: "⚠️", title: "Add Professional Summary", desc: "A 3-4 sentence professional summary dramatically improves ATS scanning and recruiter engagement." });
  }

  if (!sections.contact.found || sections.contact.strength === "weak") {
    recommendations.push({ type: "critical", icon: "📧", title: "Complete Contact Info", desc: "Include email, phone, LinkedIn profile, and GitHub/portfolio URL." });
  }

  const missingMust = requirements.must.filter((r) => !skillData.allFound.includes(r));
  if (missingMust.length > 0) {
    recommendations.push({ type: "critical", icon: "🔑", title: `Add Key Skills for ${jobRole}`, desc: `Missing critical skills: ${missingMust.join(", ")}. These are required for most ${jobRole} roles.` });
  }

  if (!sections.projects.found) {
    recommendations.push({ type: "moderate", icon: "🚀", title: "Add Projects Section", desc: "Include 2-3 notable projects with tech stack, your role, and measurable outcomes." });
  }

  if (!sections.achievements.found) {
    recommendations.push({ type: "moderate", icon: "📊", title: "Quantify Achievements", desc: "Add metrics and numbers (e.g., 'Reduced load time by 40%', 'Led team of 5 engineers') to demonstrate impact." });
  }

  if (atsScore.total < 70) {
    recommendations.push({ type: "moderate", icon: "🎯", title: "Improve ATS Optimization", desc: "Use more industry keywords and match language from job descriptions to improve ATS pass-through rates." });
  }

  recommendations.push({ type: "tip", icon: "✨", title: "Use Strong Action Verbs", desc: "Start bullet points with powerful verbs: Built, Led, Optimized, Implemented, Architected, Scaled." });
  recommendations.push({ type: "tip", icon: "📝", title: "Tailor for Each Application", desc: "Customize skills and summary section to mirror keywords from the specific job description." });

  return recommendations;
}

export function analyzeResume(text, jobRole = "Software Engineer") {
  // If no text extracted, use enriched mock
  const isReal = text.trim().length > 100;
  const analysisText = isReal ? text : generateMockText(jobRole);

  const sections = detectSections(analysisText);
  const skillData = extractSkills(analysisText);
  const atsScore = calculateATSScore(analysisText, jobRole, sections, skillData);
  const recommendations = generateRecommendations(sections, skillData, atsScore, jobRole);

  const sectionScores = Object.entries(sections).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    found: data.found,
    strength: data.strength,
    score: data.strength === "strong" ? 90 + Math.floor(Math.random() * 10) : data.strength === "moderate" ? 55 + Math.floor(Math.random() * 20) : 15 + Math.floor(Math.random() * 20),
  }));

  const categoryScores = Object.entries(skillData.byCategory).map(([cat, data]) => ({
    category: cat,
    found: data.found,
    missing: data.missing,
    score: Math.round(data.coverage * 100),
  }));

  const wordCount = analysisText.split(/\s+/).filter(Boolean).length;
  const readabilityScore = Math.min(100, 50 + wordCount / 10);

  return {
    atsScore: atsScore.total,
    atsBreakdown: atsScore.breakdown,
    sections: sectionScores,
    skills: categoryScores,
    topSkills: skillData.allFound.slice(0, 15),
    suggestedSkills: skillData.suggestions,
    recommendations,
    stats: {
      wordCount,
      skillsFound: skillData.allFound.length,
      sectionsFound: Object.values(sections).filter((s) => s.found).length,
      readabilityScore: Math.round(readabilityScore),
    },
    jobRole,
    isRealResume: isReal,
    analyzedAt: new Date().toISOString(),
  };
}

function generateMockText(jobRole) {
  const base = {
    "Software Engineer": `Alex Johnson | alex@email.com | github.com/alexj
SUMMARY: Experienced software engineer with 5+ years building scalable applications.
EXPERIENCE: Senior Engineer at MegaCorp (2021-Present) - Led React migration, built Node.js APIs, managed Docker deployments.
Software Engineer at Startup (2019-2021) - Python backend development, SQL optimization.
EDUCATION: B.S. Computer Science 2019
SKILLS: JavaScript, React, Node.js, Python, SQL, Git, Docker, AWS, REST APIs
PROJECTS: Built e-commerce platform serving 50K users`,

    "Data Scientist": `Maria Chen | maria@email.com
SUMMARY: Data scientist specializing in ML and predictive analytics.
EXPERIENCE: Data Scientist at Analytics Corp (2020-Present) - TensorFlow models, Pandas data pipelines.
EDUCATION: M.S. Data Science
SKILLS: Python, Machine Learning, TensorFlow, Pandas, NumPy, SQL, Tableau`,
  };
  return base[jobRole] || base["Software Engineer"];
}
