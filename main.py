from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

import anki

class Flashcard(BaseModel):
    f: str
    b: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"], 
    allow_headers=["Content-Type"], 
)

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/convert")
async def createAnkiDeck(cards: list[Flashcard], background: BackgroundTasks):
    deck_bytes = anki.createAnkiDeck(cards)
    
    return Response(
        content=deck_bytes,
        media_type='application/octet-stream',
        headers={
            'Content-Disposition': 'attachment; filename="flashcards.apkg"'
        }
    )