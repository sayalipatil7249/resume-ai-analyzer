from sklearn.metrics.pairwise import cosine_similarity

def compare_embeddings(
        resume_embedding,
        job_embedding
):
    score=cosine_similarity([resume_embedding],[job_embedding])

    return float(score[0][0])

