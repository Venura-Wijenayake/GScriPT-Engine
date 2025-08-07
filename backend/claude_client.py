# backend/claude_client.py

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("CLAUDE_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-sonnet-20240229")

async def generate_from_claude(prompt: str, system_prompt: str = "") -> str:
    try:
        headers = {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        json = {
            "model": CLAUDE_MODEL,
            "max_tokens": 1024,
            "temperature": 0.8,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=json
            )

        response.raise_for_status()
        result = response.json()
        return result["content"][0]["text"]

    except Exception as e:
        return f"[CLAUDE ERROR]: {str(e)}"
