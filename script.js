const fields = [
  "name",
  "email",
  "phone",
  "location",
  "linkedin",
  "github",
  "summary",
  "education",
  "projects",
  "experience",
  "certifications",
  "jobDescription"
];

let skills = [];
let photoURL = "";

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function safeText(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function addSkill() {
  const skillInput = document.getElementById("skillInput");
  const skill = skillInput.value.trim();

  if (skill !== "" && !skills.includes(skill)) {
    skills.push(skill);
    skillInput.value = "";
    renderSkills();
    generateResume();
  }
}

function renderSkills() {
  const skillTags = document.getElementById("skillTags");
  skillTags.innerHTML = "";

  skills.forEach((skill, index) => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.innerText = skill + " ×";

    tag.onclick = () => {
      skills.splice(index, 1);
      renderSkills();
      generateResume();
    };

    skillTags.appendChild(tag);
  });
}

function generateResume() {
  const name = safeText(getValue("name") || "Your Name");
  const email = safeText(getValue("email") || "your.email@example.com");
  const phone = safeText(getValue("phone") || "Phone Number");
  const location = safeText(getValue("location") || "Location");
  const linkedin = safeText(getValue("linkedin"));
  const github = safeText(getValue("github"));
  const summary = safeText(getValue("summary") || "Professional summary will appear here.");
  const education = safeText(getValue("education") || "Education details will appear here.");
  const projects = safeText(getValue("projects") || "Project details will appear here.");
  const experience = safeText(getValue("experience") || "Experience details will appear here.");
  const certifications = safeText(getValue("certifications") || "Certifications will appear here.");
  const template = document.getElementById("template").value;

  const skillsText = skills.length > 0 ? skills.join(", ") : "Skills will appear here.";

  const resume = document.getElementById("resume");
  resume.className = template;

  resume.innerHTML = `
    ${photoURL ? `<img src="${photoURL}" class="resume-photo" />` : ""}

    <h1>${name}</h1>

    <p style="text-align:center;">
      ${email} | ${phone} | ${location}
      ${linkedin ? `<br>LinkedIn: ${linkedin}` : ""}
      ${github ? `<br>GitHub: ${github}` : ""}
    </p>

    <hr>

    <h3>Professional Summary</h3>
    <p>${summary}</p>

    <h3>Technical Skills</h3>
    <p>${safeText(skillsText)}</p>

    <h3>Education</h3>
    <p>${education}</p>

    <h3>Projects</h3>
    <p>${projects}</p>

    <h3>Experience / Internship</h3>
    <p>${experience}</p>

    <h3>Certifications</h3>
    <p>${certifications}</p>
  `;

  updateProgress();
  calculateATS();
}

function updateProgress() {
  let filled = 0;

  fields.forEach(id => {
    if (getValue(id) !== "") filled++;
  });

  if (skills.length > 0) filled++;

  const total = fields.length + 1;
  const percent = Math.round((filled / total) * 100);

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText = percent + "% Complete";
}

function calculateATS() {
  let score = 0;

  if (getValue("name")) score += 8;
  if (getValue("email")) score += 8;
  if (getValue("phone")) score += 8;
  if (getValue("location")) score += 6;
  if (getValue("linkedin")) score += 6;
  if (getValue("github")) score += 6;
  if (getValue("summary").length > 40) score += 12;
  if (skills.length >= 5) score += 16;
  if (getValue("education").length > 20) score += 10;
  if (getValue("projects").length > 40) score += 12;
  if (getValue("experience").length > 20) score += 5;
  if (getValue("certifications").length > 10) score += 3;

  if (score > 100) score = 100;

  document.getElementById("atsScore").innerText = score;

  const message = document.getElementById("atsMessage");

  if (score < 40) {
    message.innerText = "Needs improvement. Add more resume details.";
  } else if (score < 75) {
    message.innerText = "Good start. Add skills, projects, and summary.";
  } else {
    message.innerText = "Great! Your resume looks ATS-friendly.";
  }
}

function getResumeText() {
  return `
    ${getValue("name")}
    ${getValue("email")}
    ${getValue("phone")}
    ${getValue("location")}
    ${getValue("linkedin")}
    ${getValue("github")}
    ${getValue("summary")}
    ${skills.join(" ")}
    ${getValue("education")}
    ${getValue("projects")}
    ${getValue("experience")}
    ${getValue("certifications")}
  `.toLowerCase();
}

function extractKeywords(text) {
  const stopWords = [
    "and", "the", "for", "with", "you", "your", "are", "this", "that",
    "from", "have", "will", "our", "can", "job", "role", "work",
    "team", "company", "candidate", "required", "preferred", "about",
    "using", "use", "must", "should", "into", "who", "has", "been",
    "their", "they", "them", "his", "her", "its", "was", "were",
    "is", "am", "to", "of", "in", "on", "at", "by", "as", "an", "a"
  ];

  return text
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
}

function analyzeJobMatch() {
  const jd = document.getElementById("jobDescription").value.trim();

  if (!jd) {
    alert("Please paste a job description first.");
    return;
  }

  const resumeText = getResumeText();
  const jdKeywords = [...new Set(extractKeywords(jd))];

  if (jdKeywords.length === 0) {
    alert("Please paste a valid job description.");
    return;
  }

  const matched = [];
  const missing = [];

  jdKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = Math.round((matched.length / jdKeywords.length) * 100);

  document.getElementById("atsScore").innerText = score;

  const atsMessage = document.getElementById("atsMessage");

  if (score < 40) {
    atsMessage.innerText = "Low job match. Add more relevant keywords from the job description.";
  } else if (score < 75) {
    atsMessage.innerText = "Good match. Add missing skills and project keywords.";
  } else {
    atsMessage.innerText = "Excellent job match. Resume is well optimized for this role.";
  }

  showKeywords("matchedKeywords", matched.slice(0, 25), "match");
  showKeywords("missingKeywords", missing.slice(0, 25), "missing");
  showTips(missing);
}

function showKeywords(containerId, keywords, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (keywords.length === 0) {
    container.innerHTML = "<p>No keywords found.</p>";
    return;
  }

  keywords.forEach(word => {
    const span = document.createElement("span");
    span.className = `keyword ${type}`;
    span.innerText = word;
    container.appendChild(span);
  });
}

function showTips(missing) {
  const tips = document.getElementById("atsTips");
  tips.innerHTML = "";

  const suggestions = [
    "Add missing keywords naturally in Skills, Projects, or Summary.",
    "Use standard resume headings like Summary, Skills, Education, Projects, and Experience.",
    "Mention tools and technologies exactly as written in the job description.",
    "Add measurable achievements in projects, such as performance, speed, users, or accuracy.",
    "Avoid images, tables, icons, and complex layouts for better ATS scanning."
  ];

  if (missing.length > 0) {
    suggestions.unshift(
      `Try adding these important missing keywords: ${missing.slice(0, 8).join(", ")}.`
    );
  }

  suggestions.forEach(tip => {
    const li = document.createElement("li");
    li.innerText = tip;
    tips.appendChild(li);
  });
}

function downloadPDF() {
  generateResume();

  const resume = document.getElementById("resume");

  const options = {
    margin: 0.5,
    filename: "ATS_Resume.pdf",
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf().set(options).from(resume).save();
}

function clearForm() {
  fields.forEach(id => {
    document.getElementById(id).value = "";
  });

  document.getElementById("skillInput").value = "";
  document.getElementById("photoUpload").value = "";
  document.getElementById("template").value = "classic";

  skills = [];
  photoURL = "";

  renderSkills();
  clearAnalysis();
  generateResume();
}

function clearAnalysis() {
  document.getElementById("matchedKeywords").innerHTML = "";
  document.getElementById("missingKeywords").innerHTML = "";
  document.getElementById("atsTips").innerHTML = "";
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

fields.forEach(id => {
  const input = document.getElementById(id);

  if (input) {
    input.addEventListener("input", generateResume);
  }
});

document.getElementById("template").addEventListener("change", generateResume);

document.getElementById("skillInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill();
  }
});

document.getElementById("photoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      photoURL = event.target.result;
      generateResume();
    };

    reader.readAsDataURL(file);
  }
});

document.getElementById("themeToggle").addEventListener("click", function() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    this.innerText = "☀️ Light Mode";
  } else {
    this.innerText = "🌙 Dark Mode";
  }
});

window.addEventListener("scroll", () => {
  const topBtn = document.querySelector(".top-btn");

  if (window.scrollY > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

generateResume();
let oldResumeText = "";

document.getElementById("oldResumeUpload").addEventListener("change", async function(e) {
  const file = e.target.files[0];

  if (!file) return;

  document.getElementById("oldResumeStatus").innerText = "Reading resume...";

  const fileName = file.name.toLowerCase();

  try {
    if (fileName.endsWith(".txt")) {
      oldResumeText = await readTextFile(file);
    } else if (fileName.endsWith(".pdf")) {
      oldResumeText = await readPDFFile(file);
    } else if (fileName.endsWith(".docx")) {
      oldResumeText = await readDocxFile(file);
    } else {
      oldResumeText = "";
      alert("Please upload TXT, PDF, or DOCX file.");
      return;
    }

    if (oldResumeText.trim().length < 30) {
      document.getElementById("oldResumeStatus").innerText =
        "Resume text could not be extracted properly.";
    } else {
      document.getElementById("oldResumeStatus").innerText =
        "Resume uploaded successfully. Click check ATS score.";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("oldResumeStatus").innerText =
      "Error reading file. Try another resume file.";
  }
});

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      resolve(e.target.result);
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function readPDFFile(file) {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + " ";
  }

  return text;
}

async function readDocxFile(file) {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer: arrayBuffer
  });

  return result.value;
}

function analyzeOldResume() {
  if (!oldResumeText.trim()) {
    alert("Please upload your old resume first.");
    return;
  }

  const jd = document.getElementById("jobDescription").value.trim();

  if (!jd) {
    alert("Please paste a job description first.");
    return;
  }

  const resumeText = oldResumeText.toLowerCase();
  const jdKeywords = [...new Set(extractKeywords(jd))];

  const matched = [];
  const missing = [];

  jdKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const keywordScore = Math.round((matched.length / jdKeywords.length) * 100);
  const structureScore = calculateOldResumeStructureScore(resumeText);

  const finalScore = Math.round((keywordScore * 0.7) + (structureScore * 0.3));

  document.getElementById("oldResumeScore").innerText = finalScore;

  const tips = document.getElementById("oldResumeTips");
  tips.innerHTML = "";

  const suggestions = [];

  if (!resumeText.includes("summary")) {
    suggestions.push("Add a Professional Summary section.");
  }

  if (!resumeText.includes("skills")) {
    suggestions.push("Add a Technical Skills section.");
  }

  if (!resumeText.includes("project")) {
    suggestions.push("Add a Projects section with technologies used.");
  }

  if (!resumeText.includes("education")) {
    suggestions.push("Add an Education section.");
  }

  if (missing.length > 0) {
    suggestions.push(
      "Add missing job keywords naturally: " + missing.slice(0, 10).join(", ")
    );
  }

  if (resumeText.length < 1200) {
    suggestions.push("Your resume content looks short. Add stronger project points and achievements.");
  }

  if (!resumeText.includes("github") && !resumeText.includes("linkedin")) {
    suggestions.push("Add GitHub and LinkedIn links.");
  }

  suggestions.push("Use simple ATS-friendly formatting without tables, icons, or graphics.");

  suggestions.forEach(tip => {
    const li = document.createElement("li");
    li.innerText = tip;
    tips.appendChild(li);
  });

  document.getElementById("oldResumeStatus").innerText =
    finalScore >= 75
      ? "Old resume looks good, but still improve keyword matching."
      : "Old resume needs improvement for this job description.";
}

function calculateOldResumeStructureScore(text) {
  let score = 0;

  if (text.includes("summary") || text.includes("objective")) score += 20;
  if (text.includes("skills")) score += 20;
  if (text.includes("project")) score += 20;
  if (text.includes("education")) score += 15;
  if (text.includes("experience") || text.includes("internship")) score += 15;
  if (text.includes("certification")) score += 10;

  return score;
}
