# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import generate_gpt, generate_titles

app = FastAPI()

# CORS setup to allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only — restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(generate_gpt.router, prefix="/api")
app.include_router(generate_titles.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "GSCRIPT Engine backend is running"}
