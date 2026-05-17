from docx import Document

def extract_text_from_docx(file):
    doc = Document(file)
    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text

#Temporary Code
if __name__ == "__main__":
    result = extract_text_from_docx("resume.docx")
    print(result)