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


resumes_data = []

# @app.post("/upload-resume")
@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    role: str = "general"
):

    # Generate unique id
    resume_id = str(uuid.uuid4())

    # File path
    file_location = f"uploads/{resume_id}_{file.filename}"

    # Save file permanently
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process resume
    result = process_resume(file_location, role)

    # Store data temporarily
    resume_data = {
        "id": resume_id,
        "filename": file.filename,
        "filepath": file_location,
        "role": role,
        "analysis": result
    }

    resumes_data.append(resume_data)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume_id,
        "data": resume_data
    }

@app.get("/resumes")
def get_all_resumes():

    return {
        "total_resumes": len(resumes_data),
        "resumes": resumes_data
    }

@app.get("/resume/{resume_id}")
def get_resume(resume_id: str):

    for resume in resumes_data:

        if resume["id"] == resume_id:
            return resume

    return {
        "message": "Resume not found"
    }

@app.get("/resume-file/{resume_id}")
def get_resume_file(resume_id: str):

    for resume in resumes_data:

        if resume["id"] == resume_id:

            return FileResponse(
    path=resume["filepath"],
    filename=resume["filename"]
)

    return {
        "message": "File not found"
    }

@app.delete("/resume/{resume_id}")
def delete_resume(resume_id: str):

    for resume in resumes_data:

        if resume["id"] == resume_id:

            if os.path.exists(resume["filepath"]):
                os.remove(resume["filepath"])

            resumes_data.remove(resume)

            return {
                "message": "Resume deleted successfully"
            }

    return {
        "message": "Resume not found"
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

    if len(resumes_data) == 0:

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

    latest_resume = resumes_data[-1]

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

    for resume in resumes_data:

        if resume["id"] == resume_id:

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

    return {
        "message": "Resume not found"
    }


class ProfileUpdate(BaseModel):
    name: str
    username: str
    email: str


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str



# Dummy user data
user_profile = {
    "name": "Sayali Patil",
    "username": "sayali",
    "email": "sayali@gmail.com",
    "role": "Admin",
    "memberSince": "2025"
}

user_password = "123456"

@app.get("/profile")
def get_profile():

    return user_profile


@app.put("/profile")
def update_profile(data: ProfileUpdate):

    user_profile["name"] = data.name
    user_profile["username"] = data.username
    user_profile["email"] = data.email

    return {
        "message": "Profile updated successfully",
        "profile": user_profile
    }

@app.put("/change-password")
def change_password(data: PasswordUpdate):

    global user_password

    if data.current_password != user_password:

        return {
            "message": "Current password is incorrect"
        }

    user_password = data.new_password

    return {
        "message": "Password updated successfully"
    }

