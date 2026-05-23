from database.connection import resume_collection


# INSERT RESUME
# INSERT RESUME
def insert_resume(data):

    result = resume_collection.insert_one(data)

    saved_resume = resume_collection.find_one({
        "_id": result.inserted_id
    })

    saved_resume["_id"] = str(saved_resume["_id"])

    return saved_resume


# GET ALL RESUMES
def get_all_resumes():

    resumes = list(resume_collection.find())

    for resume in resumes:

        resume["_id"] = str(resume["_id"])

    return resumes


# GET SINGLE RESUME
def get_resume_by_id(resume_id):

    resume = resume_collection.find_one({

        "resume_id": resume_id

    })

    if resume:

        resume["_id"] = str(resume["_id"])

    return resume


# DELETE RESUME
def delete_resume_by_id(resume_id):

    return resume_collection.delete_one({

        "resume_id": resume_id

    })


# GET LATEST RESUME
def get_latest_resume():

    resume = resume_collection.find_one(

        sort=[("_id", -1)]

    )

    if resume:

        resume["_id"] = str(resume["_id"])

    return resume