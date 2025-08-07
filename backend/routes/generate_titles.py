# backend/routes/generate_titles.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/generate-titles")
async def generate_titles_stub():
    return {"message": "Title generation not implemented yet"}
