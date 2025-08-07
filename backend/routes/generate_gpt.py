# backend/routes/generate_gpt.py

from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# Load Claude logic
from claude_client import generate_from_claude

load_dotenv()

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()

class GPTRequest(BaseModel):
    prompt: str
    role: str = "default"
    global_config: dict = {}
    title: str | None = None

@router.post("/generate-gpt")
async def generate_gpt(req: GPTRequest):
    try:
        # Swap to Claude if enabled in .env
        if LLM_PROVIDER == "claude":
            result = await generate_from_claude(
                prompt=req.prompt,
                system_prompt=f"You are a YouTube scriptwriter. Tone: {req.global_config.get('tone', 'Neutral')}."
            )
            return {
                "result": result,
                "rawPrompt": req.prompt
            }

        # Default: OpenAI GPT
        messages = [
            {
                "role": "system",
                "content": f"You are a YouTube scriptwriter. Tone: {req.global_config.get('tone', 'Neutral')}."
            },
            {
                "role": "user",
                "content": req.prompt
            }
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.8,
            max_tokens=800
        )

        result = response.choices[0].message.content
        return {
            "result": result,
            "rawPrompt": req.prompt
        }

    except Exception as e:
        return {"error": str(e)}
