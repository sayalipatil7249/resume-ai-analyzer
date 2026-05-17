# Role-based scoring configuration for dynamic ATS system

ROLE_WEIGHTS = {

    # -------------------------
    # GENERAL PROFILE
    # -------------------------
    "general": {
        "skills": 0.4,
        "projects": 0.2,
        "experience": 0.2,
        "education": 0.1,
        "certifications": 0.1
    },

    # -------------------------
    # SOFTWARE DEVELOPMENT
    # -------------------------
    "software_engineer": {
        "skills": 0.45,
        "projects": 0.25,
        "experience": 0.2,
        "education": 0.05,
        "certifications": 0.05
    },

    "frontend_developer": {
        "skills": 0.5,
        "projects": 0.3,
        "experience": 0.1,
        "education": 0.05,
        "certifications": 0.05
    },

    "backend_developer": {
        "skills": 0.5,
        "projects": 0.25,
        "experience": 0.15,
        "education": 0.05,
        "certifications": 0.05
    },

    "fullstack_developer": {
        "skills": 0.45,
        "projects": 0.3,
        "experience": 0.15,
        "education": 0.05,
        "certifications": 0.05
    },

    "mobile_developer": {
        "skills": 0.5,
        "projects": 0.3,
        "experience": 0.1,
        "education": 0.05,
        "certifications": 0.05
    },

    # -------------------------
    # DATA / AI ROLES
    # -------------------------
    "ml_engineer": {
        "skills": 0.55,
        "projects": 0.25,
        "experience": 0.1,
        "education": 0.05,
        "certifications": 0.05
    },

    "data_scientist": {
        "skills": 0.45,
        "projects": 0.25,
        "experience": 0.1,
        "education": 0.1,
        "certifications": 0.1
    },

    "data_analyst": {
        "skills": 0.4,
        "projects": 0.2,
        "experience": 0.1,
        "education": 0.2,
        "certifications": 0.1
    },

    # -------------------------
    # CLOUD / DEVOPS
    # -------------------------
    "devops_engineer": {
        "skills": 0.5,
        "projects": 0.2,
        "experience": 0.2,
        "education": 0.05,
        "certifications": 0.05
    },

    "cloud_engineer": {
        "skills": 0.5,
        "projects": 0.2,
        "experience": 0.2,
        "education": 0.05,
        "certifications": 0.05
    },

    # -------------------------
    # DATABASE / BACKEND SUPPORT
    # -------------------------
    "database_engineer": {
        "skills": 0.45,
        "projects": 0.15,
        "experience": 0.2,
        "education": 0.1,
        "certifications": 0.1
    },

    # -------------------------
    # QUALITY ASSURANCE
    # -------------------------
    "qa_engineer": {
        "skills": 0.45,
        "projects": 0.2,
        "experience": 0.2,
        "education": 0.1,
        "certifications": 0.05
    },

    # -------------------------
    # SECURITY
    # -------------------------
    "cyber_security": {
        "skills": 0.5,
        "projects": 0.2,
        "experience": 0.15,
        "education": 0.05,
        "certifications": 0.1
    }
}