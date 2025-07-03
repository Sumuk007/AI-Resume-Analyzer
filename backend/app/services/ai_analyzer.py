import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY")) # type: ignore

model = genai.GenerativeModel("gemini-1.5-flash")  # type: ignore # or "gemini-1.5-flash" if you want faster responses

def analyze_resume(resume_text: str, job_description: str) -> str:
    prompt = f"""
    Compare this resume to the job description and give a score out of 100. 
    Mention:
    - Matching skills
    - Missing or weak skills
    - Suggestions for improvement

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    try:
        response = model.generate_content(prompt)
        print(f"response generated successfully {response.text.strip()}")
        return response.text.strip()

    except ResourceExhausted as e:
        return "❌ Gemini quota limit reached. Please wait and try again later or use a different API key."
