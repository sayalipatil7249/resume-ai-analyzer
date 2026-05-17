import re

ROLE_KEYWORDS = {
    "ml_engineer": ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp"],
    "data_scientist": ["data science", "pandas", "numpy", "statistics"],
    "data_analyst": ["sql", "excel", "power bi", "tableau"],
    "frontend_developer": ["html", "css", "javascript", "react"],
    "backend_developer": ["api", "fastapi", "django", "node"],
    "fullstack_developer": ["frontend", "backend", "react", "node"],
    "devops_engineer": ["docker", "kubernetes", "ci/cd", "jenkins", "aws"],
    "cloud_engineer": ["aws", "azure", "gcp", "cloud"],
    "cyber_security": ["security", "encryption", "hacking"],
    "mobile_developer": ["android", "flutter", "kotlin"],
    "qa_engineer": ["testing", "selenium", "automation"],
    "software_engineer": ["java", "c++", "system design", "oop"]
}

def detect_role(text):

    text = text.lower()

    role_scores = {}

    for role, keywords in ROLE_KEYWORDS.items():
        score = 0

        for kw in keywords:
            score += text.count(kw)

        role_scores[role] = score

    best_role = max(role_scores, key=role_scores.get)
    max_score = role_scores[best_role]

    total = sum(role_scores.values()) + 1

    confidence = round((max_score / total) * 100, 2)

    return {
        "predicted_role": best_role,
        "confidence": confidence,
        "all_scores": role_scores
    }