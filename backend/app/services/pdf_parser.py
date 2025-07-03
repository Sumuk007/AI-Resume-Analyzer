import pdfplumber

def extract_text_from_pdf(file) -> str:
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()
