from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_analyzer import analyze_resume
from fastapi.responses import JSONResponse

app = FastAPI()

origins = [
    "https://resumeanalyzer-ai.vercel.app",
    "http://localhost:5173"
    ]

# Allow frontend access (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ✅ Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to the AI Resume Analyzer!"}

@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "ok"}, status_code=200)

@app.post("/analyze/")
async def analyze_resume_endpoint(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        resume_text = extract_text_from_pdf(resume)
        result = analyze_resume(resume_text, job_description)

         # Handle quota error message cleanly
        if result.startswith("❌ Gemini quota limit reached"):
            return JSONResponse(content={"error": result}, status_code=429)

        return JSONResponse(content={"analysis": result})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)