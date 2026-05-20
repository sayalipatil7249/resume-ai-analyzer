from fastapi import FastAPI, UploadFile, File
from ai_module.pipeline import process_resume
from ai_module.job_matching.match import calculate_match
from ai_module.job_matching.missing_skills import get_missing_skills
from pydantic import BaseModel
from ai_module.embeddings.generate_embeddings import generate_embedding
from ai_module.embeddings.similarity import compare_embeddings
from ai_module.search.search import search_resumes
import os

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

@app.post("/upload-resume")
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), role: str = "general"):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(await file.read())

    result = process_resume(file_location, role)

    os.remove(file_location)

    return {
        "filename": file.filename,
        "data": result,
        "status": "success"
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