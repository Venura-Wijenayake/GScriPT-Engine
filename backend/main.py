from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os

# ⬇️ Import from your utilities
from key_reset import update_key
from key_validator import check_openai_key

# Load API key from .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 Temporarily allow any localhost port
    allow_credentials=True,
    allow_methods=["*"],         # ✅ Required for CORS preflight
    allow_headers=["*"],         # ✅ Required for CORS preflight
)

# Define request schema for GPT
class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_text(req: PromptRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": req.prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        content = response.choices[0].message["content"].strip()
        return { "response": content }

    except Exception as e:
        return { "error": str(e) }

# Handle OPTIONS preflight manually
@app.options("/generate")
async def options_handler():
    return JSONResponse(
        content={},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

# ⬇️ Schema for key validation/reset routes
class KeyPayload(BaseModel):
    key: str
    value: str

# ✅ Validate OpenAI key
@app.post("/validate-key")
async def validate_key(payload: KeyPayload):
    if payload.key != "OPENAI_API_KEY":
        return { "valid": False, "error": "Unsupported key type." }

    openai.api_key = payload.value
    try:
        openai.Model.list()
        return { "valid": True }
    except Exception as e:
        return { "valid": False, "error": str(e) }

# ✅ Update key in .env file
@app.post("/update-key")
async def update_key_route(payload: KeyPayload):
    if payload.key != "OPENAI_API_KEY":
        return { "success": False, "error": "Unsupported key type." }

    try:
        update_key(payload.key, payload.value)
        return { "success": True }
    except Exception as e:
        return { "success": False, "error": str(e) }

# ✅ Root route to handle browser GETs and suppress "Invalid HTTP request"
@app.get("/")
def root():
    return { "message": "✅ GScript API is running." }
