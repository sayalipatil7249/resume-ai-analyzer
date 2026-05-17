import random

def generate_explanation(score_data, skills, role):

    breakdown = score_data["breakdown"]
    score = score_data["score"]

    explanation = []

    # Skill analysis
    if breakdown["skills"] > 30:
        explanation.append("Strong technical skill set detected.")
    else:
        explanation.append("Skills section can be improved.")

    # Project analysis
    if breakdown["projects"] > 15:
        explanation.append("Good project experience with real implementations.")
    else:
        explanation.append("Add more impactful projects with technologies used.")

    # Experience analysis
    if breakdown["experience"] < 10:
        explanation.append("Limited internship or work experience.")

    # Education
    if breakdown["education"] >= 8:
        explanation.append("Strong academic background.")

    # Certifications
    if breakdown["certifications"] >= 5:
        explanation.append("Relevant certifications found.")

    # Skills insight
    if len(skills) < 5:
        explanation.append("Consider adding more technical skills.")

    # Final summary (UPGRADED)
    if score >= 85:
        level = f"Excellent candidate profile for {role}"
    elif score >= 70:
        level = f"Good candidate profile for {role}"
    elif score >= 50:
        level = f"Average candidate profile for {role}"
    else:
        level = f"Needs improvement for {role}"

    
   

    extra_insights = []

    if "python" in skills:
        extra_insights.append("Python skill is a strong advantage.")

    if "java" in skills:
        extra_insights.append("Java experience indicates strong OOP fundamentals.")

    if len(skills) > 8:
        extra_insights.append("Diverse technical stack improves job readiness.")

    if breakdown["projects"] > 15:
        extra_insights.append("Project depth is strong and industry-relevant.")

    return {
        "summary": level,
        "details": explanation + random.sample(extra_insights, min(len(extra_insights), 2)),
        "role_analyzed": role
    }

