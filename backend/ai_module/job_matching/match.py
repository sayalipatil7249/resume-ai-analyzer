def calculate_match(
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

    common=(
       resume_set & job_set
    )

    print("Resume:",resume_set)
    print("Job:",job_set)
    print("Common:",common)

    score=(
        len(common)/len(job_set)
    )*100

    return round(
        score,
        2
    )