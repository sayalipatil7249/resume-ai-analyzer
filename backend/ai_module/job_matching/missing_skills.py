def get_missing_skills(
        resume_skills,
        job_skills
):
    resume_set=set(
        skill.lower()
        for skill in resume_skills
    )

    job_set=set(
        skill.lower()
        for skill in job_skills
    )

    missing=(
        job_set - resume_set
    )

    return list(missing)

