from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

import anki
import os

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

def cleanup(file: str):
    if os.path.exists(file):
        os.remove(file)

@app.post("/")
async def createAnkiDeck(cards : list[Flashcard], background : BackgroundTasks):
    output_file = anki.createAnkiDeck(cards)
    
    background.add_task(cleanup, output_file)
    
    return FileResponse(
        output_file,
        media_type='application/octet-stream',
        filename='flashcards.apkg'
    )