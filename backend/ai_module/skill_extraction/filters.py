# filters.py

STOPWORDS = [
    "project", "projects",
    "team", "teams",
    "experience",
    "work", "worked",
    "company",
    "role",
    "responsible",
    "developed",
    "using",
    "used",
    "based",
    "application",
    "system",
    "management"
]


def filter_words(words):
    """
    Remove unwanted words (non-skills) from extracted list
    """

    filtered = []

    for word in words:
        if word not in STOPWORDS and len(word) > 2:
            filtered.append(word)

    return filtered