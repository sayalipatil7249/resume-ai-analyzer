import re

def clean_text(text):
    # 1. Convert to lowercase
    text = text.lower()

    # 2. Remove URLs (linkedin etc.)
    text = re.sub(r'http\S+|www\S+', '', text)

    # 3. Remove emails
    text = re.sub(r'\S+@\S+', '', text)

    # 4. Remove phone numbers
    text = re.sub(r'\+?\d[\d -]{8,}\d', '', text)

    # 5. Replace special characters with SPACE (not remove)
    text = re.sub(r'[^a-zA-Z0-9]', ' ', text)

    # 6. Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()

    return text