import genanki
import random

ANKI_MODEL = genanki.Model(
    random.randrange(1 << 30, 1 << 31),
    'Simple Model',
    fields=[
        {'name': 'Question'},
        {'name': 'Answer'},
    ],
    templates=[
        {
            'name': 'Card 1',
            'qfmt': '{{Question}}',
            'afmt': '{{FrontSide}}<hr id="answer">{{Answer}}',
        },
    ]
)

def createAnkiDeck(flashcards: list, deck_name: str = 'NotebookLM Flashcards') -> str:
    deck_id = random.randrange(1 << 30, 1 << 31)
    deck = genanki.Deck(deck_id, deck_name)
    
    for card in flashcards:
        note = genanki.Note(
            model=ANKI_MODEL,
            fields=[card.f, card.b]
        )
        deck.add_note(note)
    
    output_file = f'deck_{deck_id}.apkg'
    genanki.Package(deck).write_to_file(output_file)
    
    return output_file