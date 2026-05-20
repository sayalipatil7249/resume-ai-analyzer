from ai_module.embeddings.generate_embeddings import generate_embedding
from ai_module.embeddings.similarity import compare_embeddings

def search_resumes(query,resumes):
    query_embedding=generate_embedding(query)

    results=[]
    for resume in resumes:
        resume_embedding=generate_embedding(resume)
        score=compare_embeddings(query_embedding,resume_embedding)

        results.append({
            "resume":resume,
            "score":score
        })
    results.sort(key=lambda x:
                     x["score"],reverse=True)
    return results
    

