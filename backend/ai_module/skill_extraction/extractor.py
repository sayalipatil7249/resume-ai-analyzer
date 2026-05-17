import re
from .skills_list import SKILLS
from .skill_mapper import normalize_text


def extract_skills(text):
    text = normalize_text(text)

    found_skills = set()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found_skills.add(skill)

    return sorted([skill.title() for skill in found_skills])