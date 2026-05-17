import re
import random
from ai_module.scoring.role_config import ROLE_WEIGHTS
# =========================
# KEYWORD LISTS (ADD HERE)
# =========================

EXPERIENCE_KEYWORDS = [
    "intern", "internship",
    "worked on", "worked at",
    "developed", "built", "created", "implemented",
    "training", "industrial training",
    "experience", "project work",
    "collaborated", "team work"
]

EDUCATION_KEYWORDS = [
    "btech", "b.e", "bachelor",
    "engineering", "computer science",
    "cgpa", "percentage",
    "university", "college",
    "school", "degree"
]

CERTIFICATION_KEYWORDS = [
    "certified", "certificate",
    "course", "completed course",
    "nptel", "coursera", "udemy",
    "workshop", "training program",
    "hackathon", "participation"
]

# -----------------------------
# 1. Skill Importance System
# -----------------------------

SKILL_WEIGHTS = {
    "python": 10,
    "java": 8,
    "sql": 8,
    "machine learning": 10,
    "fastapi": 7,
    "javascript": 6,
    "html": 3,
    "css": 3,
    "git": 2
}




# -----------------------------
# Helper
# -----------------------------

def count_keywords(text, keywords):
    count = 0
    for word in keywords:
        if re.search(r"\b" + re.escape(word) + r"\b", text):
            count += 1
    return count

# -----------------------------
# 1. Skill Score (WEIGHTED)
# -----------------------------

def score_skills(skills, text):
    total = 0

    for skill in skills:
        key = skill.lower()

        base = SKILL_WEIGHTS.get(key, 2)

        # frequency boost
        frequency = text.count(key)

        total += base + (frequency * 0.5)

    return min(total, 40)

# -----------------------------
# 2. Project Score (QUALITY BASED)
# -----------------------------

def score_projects(text):

    strong_keywords = [
        "built", "developed", "implemented",
        "deployed", "api", "system", "real-time"
    ]

    score = 0

    for word in strong_keywords:
        score += text.count(word) * 3

    # advanced boost
    if "machine learning" in text:
        score += 6

    if "project" in text:
        score += 3

    # diversity boost
    project_count = text.count("project")

    score += project_count * 2

    return min(score, 20)



# -----------------------------
# 3. Experience Score
# -----------------------------

def score_experience(text):
    score = 0

    for word in EXPERIENCE_KEYWORDS:
        if word in text:
            score += 2

    if "intern" in text or "internship" in text:
        score += 5

    return min(score, 20)

# -----------------------------
# 4. Education Score
# -----------------------------

def score_education(text):
    score = 0

    for word in EDUCATION_KEYWORDS:
        if word in text:
            score += 2

    if "btech" in text or "engineering" in text:
        score += 3

    return min(score, 10)

# -----------------------------
# 5. Certifications Score
# -----------------------------

def score_certifications(text):
    score = 0

    for word in CERTIFICATION_KEYWORDS:
        if word in text:
            score += 2

    if "nptel" in text or "coursera" in text or "udemy" in text:
        score += 3

    return min(score, 10)

# -----------------------------
# Feedback Generator (NEW)
# -----------------------------

def generate_feedback(skills, text, score_data):

    feedback = []
    breakdown = score_data["breakdown"]

    # -------------------------
    # SKILLS DYNAMIC FEEDBACK
    # -------------------------
    if len(skills) < 4:
        feedback.append("Your skill set is limited. Add more technical technologies.")
    elif len(skills) < 8:
        feedback.append("Good skill base, but adding more tools will improve profile.")
    else:
        feedback.append("Strong and diverse skill set detected.")

    # -------------------------
    # PROJECTS DYNAMIC FEEDBACK
    # -------------------------
    if breakdown["projects"] < 10:
        feedback.append("Add more real-world projects with implementation details.")
    elif breakdown["projects"] < 15:
        feedback.append("Projects are good but can include deployment or scalability.")
    else:
        feedback.append("Strong project experience with good technical depth.")

    # -------------------------
    # EXPERIENCE DYNAMIC FEEDBACK
    # -------------------------
    if breakdown["experience"] == 0:
        feedback.append("No internship/work experience detected.")
    elif breakdown["experience"] < 10:
        feedback.append("Some experience present, but needs improvement.")
    else:
        feedback.append("Good practical industry exposure.")

    # -------------------------
    # CLOUD / MODERN SKILL GAP
    # -------------------------
    if "aws" not in text and "docker" not in text:
        feedback.append("Consider adding cloud and DevOps skills like AWS or Docker.")

    # -------------------------
    # RANDOMIZATION (IMPORTANT FIX)
    # -------------------------
    improvement_suggestions = [
        "Improve GitHub portfolio with deployed projects.",
        "Add system design knowledge for better opportunities.",
        "Work on real-time project deployment experience.",
        "Include internships for stronger profile."
    ]

    feedback.append(random.choice(improvement_suggestions))

    return feedback



def uniqueness_score(text):
    words = set(text.split())

    total_words = len(text.split())

    diversity = len(words) / total_words

    return diversity * 10







# -----------------------------
# MAIN FUNCTION
# -----------------------------

def calculate_resume_score(cleaned_text, skills, role="general"):

    weights = ROLE_WEIGHTS.get(role, ROLE_WEIGHTS["general"])

    skills_score = score_skills(skills, cleaned_text)
    project_score = score_projects(cleaned_text)
    exp_score = score_experience(cleaned_text)
    edu_score = score_education(cleaned_text)
    cert_score = score_certifications(cleaned_text)

    # -----------------------------
    # APPLY ROLE WEIGHTS (IMPORTANT FIX)
    # -----------------------------
    total = (
        skills_score * weights["skills"] +
        project_score * weights["projects"] +
        exp_score * weights["experience"] +
        edu_score * weights["education"] +
        cert_score * weights["certifications"]
    )
    # NEW ADDITION
    total += uniqueness_score(cleaned_text) 

    score_data = {
    "score": total,
    "breakdown": {
        "skills": skills_score,
        "projects": project_score,
        "experience": exp_score,
        "education": edu_score,
        "certifications": cert_score
    }
}
    

    feedback = generate_feedback(skills, cleaned_text, score_data)

    return {
        "role": role,
        "score": min(int(total), 100),
        "breakdown": {
            "skills": skills_score,
            "projects": project_score,
            "experience": exp_score,
            "education": edu_score,
            "certifications": cert_score
        },
        "weights_used": weights,
        "feedback": feedback
    }