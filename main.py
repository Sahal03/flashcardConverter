import csv
import io
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, HTTPException
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
    allow_methods=["POST", "OPTIONS", "GET"], 
    allow_headers=["*"], 
)

HEADER_FRONT_KEYWORDS = {"front", "question", "q", "header", "term", "prompt"}
HEADER_BACK_KEYWORDS = {"back", "answer", "a", "definition", "response"}

def parse_csv_to_flashcards(csv_text: str) -> list[Flashcard]:
    cards = []
    if csv_text.startswith('\ufeff'):
        csv_text = csv_text[1:]

    stream = io.StringIO(csv_text)
    reader = csv.reader(stream)
    first_row = True

    for row in reader:
        if not row or len(row) < 2:
            continue
        
        col1 = row[0].strip()
        col2 = row[1].strip()

        if not col1 and not col2:
            continue

        if first_row:
            first_row = False
            if col1.lower() in HEADER_FRONT_KEYWORDS and col2.lower() in HEADER_BACK_KEYWORDS:
                continue

        cards.append(Flashcard(f=col1, b=col2))

    return cards

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

@app.post("/convert-csv")
async def createAnkiDeckFromCSV(file: UploadFile = File(...)):
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    try:
        csv_text = contents.decode('utf-8-sig')
    except UnicodeDecodeError:
        try:
            csv_text = contents.decode('latin-1')
        except Exception:
            raise HTTPException(status_code=400, detail="Could not decode CSV file. Ensure it is UTF-8 encoded.")

    cards = parse_csv_to_flashcards(csv_text)
    if not cards:
        raise HTTPException(status_code=400, detail="No flashcards found in the uploaded CSV file.")

    deck_bytes = anki.createAnkiDeck(cards)

    return Response(
        content=deck_bytes,
        media_type='application/octet-stream',
        headers={
            'Content-Disposition': 'attachment; filename="flashcards.apkg"'
        }
    )