import re

MAPPING = {
    "ml": "machine learning",
    "dl": "deep learning",
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "reactjs": "react",
    "angularjs": "angular",
    "vuejs": "vue",
    "nodejs": "node js",
    "expressjs": "express",
    "sklearn": "scikit learn",
    "gcp": "google cloud",
    "k8s": "kubernetes",
    "postgres": "postgresql"
}


def normalize_text(text):
    for short, full in MAPPING.items():
        pattern = r"\b" + re.escape(short) + r"\b"
        text = re.sub(pattern, full, text)

    return text