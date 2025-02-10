from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Dataset Analyzer API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router)

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Dataset Analyzer API is running"
    }