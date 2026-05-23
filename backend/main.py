from fastapi import FastAPI, UploadFile, File
from ai_module.pipeline import process_resume
from ai_module.job_matching.match import calculate_match
from ai_module.job_matching.missing_skills import get_missing_skills
from pydantic import BaseModel
from ai_module.embeddings.generate_embeddings import generate_embedding
from ai_module.embeddings.similarity import compare_embeddings
from ai_module.search.search import search_resumes
import os

from fastapi.middleware.cors import CORSMiddleware


from fastapi.responses import FileResponse
import shutil
import uuid

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from bson import ObjectId

from database.resume_queries import (
    insert_resume,
    get_all_resumes,
    get_resume_by_id,
    delete_resume_by_id,
    get_latest_resume
)

from database.user_queries import (
    get_user,
    update_user,
    update_password,
    create_user,
    login_user
)
class SignupRequest(BaseModel):

    name: str
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):

    email: str
    password: str

class MatchRequest(BaseModel):
    resume_skills:list
    job_skills:list

class SimilarityRequest(BaseModel):
    resume_text:str
    job_text:str

class SearchRequest(BaseModel):
    query:str
    resumes:list[str]


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)




# @app.post("/upload-resume")
@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    role: str = "general"
):

    resume_id = str(uuid.uuid4())

    file_location = f"uploads/{resume_id}_{file.filename}"

    with open(file_location, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    result = process_resume(file_location, role)

    resume_data = {

        "resume_id": resume_id,

        "filename": file.filename,

        "filepath": file_location,

        "role": role,

        "analysis": result

    }

    saved_resume = insert_resume(resume_data)

    return {

    "message": "Resume uploaded successfully",

    "resume_id": resume_id,

    "data": saved_resume

}

@app.get("/resumes")
def fetch_resumes():

    resumes = get_all_resumes()

    serialized_resumes = resumes

    return {

    "total_resumes": len(serialized_resumes),

    "resumes": serialized_resumes

}

@app.get("/resume/{resume_id}")
def fetch_resume(resume_id: str):

    resume = get_resume_by_id(resume_id)

    if resume:

        return resume

    return {

        "message": "Resume not found"

    }

@app.get("/resume-file/{resume_id}")
def get_resume_file(resume_id: str):

    resume = get_resume_by_id(resume_id)

    if resume:

        return FileResponse(
            path=resume["filepath"],
            filename=resume["filename"]
        )

    return {
        "message": "File not found"
    }

@app.delete("/resume/{resume_id}")
def remove_resume(resume_id: str):

    resume = get_resume_by_id(resume_id)

    if not resume:

        return {

            "message": "Resume not found"

        }

    if os.path.exists(resume["filepath"]):

        os.remove(resume["filepath"])

    delete_resume_by_id(resume_id)

    return {

        "message": "Resume deleted successfully"

    }


#Utkarsha's work 
@app.post("/match")
def match_resume(
    data:MatchRequest
):
    score=calculate_match(
        data.resume_skills,
        data.job_skills
    )

    missing=get_missing_skills(
        data.resume_skills,
        data.job_skills
    )

    return{
        "match_percentage":
        score,
        "missing_skills":
        missing
    }

@app.post("/similarity")

def similarity_check(data:SimilarityRequest):
    resume_embedding=generate_embedding(data.resume_text)
    job_embedding=generate_embedding(data.job_text)

    score=compare_embeddings(resume_embedding,job_embedding)

    return{
        "Similarity_score":score
    }

@app.post("/search")

def smart_search(
    data: SearchRequest
):

    results = search_resumes(

        data.query,

        data.resumes

    )

    return {

        "results":
        results

    }



# Dashboard API
@app.get("/api/dashboard")
def get_dashboard():

    latest_resume = get_latest_resume()

    if not latest_resume:

        return {
            "overallScore": 0,
            "predictedRole": "No Resume Uploaded",
            "confidence": 0,
            "matchedSkills": 0,
            "totalSkills": 0,
            "missingSkills": 0,
            "radarData": [],
            "topSkills": [],
            "feedback": []
        }

    analysis = latest_resume["analysis"]

    extracted_skills = analysis.get("skills", [])

    total_skills = len(extracted_skills)

    matched_skills = int(total_skills * 0.75)

    missing_skills = total_skills - matched_skills

    return {

        "overallScore": analysis.get("score", 0),

        "predictedRole": analysis.get(
            "predicted_role",
            latest_resume["role"]
        ),

        "confidence": 92,

        "matchedSkills": matched_skills,

        "totalSkills": total_skills,

        "missingSkills": missing_skills,

        "radarData": [
            {"subject": "Skills", "A": 85},
            {"subject": "Projects", "A": 75},
            {"subject": "Experience", "A": 70},
            {"subject": "Education", "A": 80},
            {"subject": "Certifications", "A": 65},
        ],

        "topSkills": extracted_skills[:10],

        "feedback": analysis.get(
            "feedback",
            [
                "Strong technical skills detected.",
                "Improve projects section."
            ]
        )
    }


from fastapi.responses import FileResponse

@app.get("/download-report/{resume_id}")
def download_report(resume_id: str):

    resume = get_resume_by_id(resume_id)

    if not resume:

        return {
            "message": "Resume not found"
        }

    report_path = f"reports/{resume_id}.txt"

    os.makedirs("reports", exist_ok=True)

    analysis = resume["analysis"]

    with open(report_path, "w", encoding="utf-8") as f:

        f.write("RESUME ANALYSIS REPORT\n")
        f.write("=" * 50 + "\n\n")

        f.write(f"Filename: {resume['filename']}\n")
        f.write(f"Role: {analysis.get('predicted_role')}\n")
        f.write(f"Score: {analysis.get('score')}\n\n")

        f.write("SKILLS\n")
        f.write("-" * 30 + "\n")

        for skill in analysis.get("skills", []):
            f.write(f"- {skill}\n")

        f.write("\nFEEDBACK\n")
        f.write("-" * 30 + "\n")

        for fb in analysis.get("feedback", []):
            f.write(f"- {fb}\n")

    return FileResponse(
        path=report_path,
        filename=f"{resume['filename']}_report.txt",
        media_type="text/plain"
    )


class ProfileUpdate(BaseModel):
    name: str
    username: str
    email: str


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str





@app.get("/profile")
def fetch_profile():

    user = get_user()

    return {

        "name": user["name"],

        "username": user["username"],

        "email": user["email"],

        "role": user["role"],

        "memberSince": user["memberSince"]

    }


@app.put("/profile")
def update_profile_api(data: ProfileUpdate):

    update_user(data)

    return {

        "message": "Profile updated successfully"

    }

@app.put("/change-password")
def change_password_api(data: PasswordUpdate):

    success = update_password(

        data.current_password,

        data.new_password

    )

    if not success:

        return {

            "message": "Current password incorrect"

        }

    return {

        "message": "Password updated successfully"

    }

@app.post("/signup")
def signup(data: SignupRequest):

    user_data = {

        "name": data.name,
        "username": data.username,
        "email": data.email,
        "password": data.password,
        "role": "User",
        "memberSince": "2026"

    }

    result = create_user(user_data)

    if not result:

        return {

            "message": "User already exists"

        }

    return {

        "message": "Signup successful"

    }

@app.post("/login")
def login(data: LoginRequest):

    user = login_user(

        data.email,
        data.password

    )

    if not user:

        return {

            "message": "Invalid email or password"

        }

    return {

        "message": "Login successful",

        "user": user

    }
