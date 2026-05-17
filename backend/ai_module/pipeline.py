from ai_module.text_processing.pdf_extractor import extract_text_from_pdf
from ai_module.text_processing.docx_extractor import extract_text_from_docx
from ai_module.text_processing.cleaner import clean_text
from ai_module.skill_extraction import extract_skills

# NEW IMPORT
from ai_module.scoring.scorer import calculate_resume_score
from ai_module.scoring.role_detector import detect_role
from ai_module.scoring.explainer import generate_explanation


def process_resume(file_path, role=None):

    file_path = file_path.lower()

    # -----------------------------
    # STEP 1: EXTRACT TEXT
    # -----------------------------
    if file_path.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_path)

    elif file_path.endswith(".docx"):
        raw_text = extract_text_from_docx(file_path)

    else:
        return {"error": "Unsupported file format"}

    # -----------------------------
    # STEP 2: CLEAN + SKILLS
    # -----------------------------
    cleaned_text = clean_text(raw_text)
    skills = extract_skills(cleaned_text)

    # -----------------------------
    # STEP 3: ROLE DETECTION
    # -----------------------------
    if role is None:
        role_info = detect_role(cleaned_text)
        role = role_info["predicted_role"]
    else:
        role_info = {"predicted_role": role}

    # -----------------------------
    # STEP 4: SCORING
    # -----------------------------
    score_data = calculate_resume_score(cleaned_text, skills, role)

    # -----------------------------
    # STEP 5: EXPLANATION
    # -----------------------------
    explanation = generate_explanation(score_data, skills, role)

    # -----------------------------
    # FINAL OUTPUT
    # -----------------------------
    return {
        "role_detection": role_info,
        "cleaned_text": cleaned_text,
        "skills": skills,
        "score": score_data,
        "explanation": explanation
    }


if __name__ == "__main__":
    result = process_resume("text_processing/resume.pdf")  # or resume.docx
    print("\nFINAL OUTPUT:\n")
    print(result)