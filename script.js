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
  "certifications"
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

function downloadPDF() {
  generateResume();

  const resume = document.getElementById("resume");

  const options = {
    margin: 0.5,
    filename: "ATS_Resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
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
  generateResume();
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

fields.forEach(id => {
  document.getElementById(id).addEventListener("input", generateResume);
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
