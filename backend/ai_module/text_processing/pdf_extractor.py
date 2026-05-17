import pdfplumber
from ai_module.text_processing.cleaner import clean_text

def extract_text_from_pdf(file):
    text = ""

    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:   # avoid None
                text += extracted + "\n"

    return text


#Temporary Code
if __name__ == "__main__":
    raw_text = extract_text_from_pdf("resume.pdf")
    clean = clean_text(raw_text)
    print("Extracted Text:\n")
    
    print("\nCLEAN TEXT:\n")
    print(clean)