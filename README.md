# Flashcards Converter ![Extension Users](https://img.shields.io/chrome-web-store/users/gfpdgeimnjeibphkimmeeigedjffdnnp)  
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)  
A Chrome extension that exports flashcards from Google's NotebookLM to CSV, and converts any CSV flashcard file into an Anki package.

## Overview

Flashcards Converter is a Chrome extension with two functions:

1. **Download CSV** — triggers NotebookLM's built-in download button to save your flashcard set as a `.csv` file.
2. **CSV to Anki Converter** — a drag-and-drop / file-picker panel that accepts any `.csv` flashcard file and converts it to an Anki package (`.apkg`) via the cloud backend.

The extension connects to a cloud-hosted backend on Google Cloud Run, so there's no local server setup required.

<img width="297" height="221" alt="image" src="https://github.com/user-attachments/assets/c8480ba7-95e4-4aee-b267-df4d5abae6bf" />

## Changelog

### v1.1 — Flashcards Converter
- **Renamed** extension from "NotebookLM Flashcard Exporter" to "Flashcards Converter"
- **Removed** one-click "Export Anki" flow (previously the extension intercepted the CSV in-memory and immediately piped it to the backend)
- **Added** CSV-to-Anki drag-and-drop / file-browse panel — always visible in the popup, accepts any `.csv` file and downloads the resulting `.apkg`
- **Simplified** the NotebookLM button-click injected script — removed all prototype monkey-patching (`URL.createObjectURL`, `HTMLAnchorElement.click`, `FileReader.readAsText`) that were only needed for the old interception flow

### v1.0 — NotebookLM Flashcard Exporter
- One-click **Export CSV**: injected a script into the NotebookLM page that intercepted the CSV blob before it reached the browser's download manager, then saved it as a file
- One-click **Export Anki**: same interception flow but piped the captured CSV text directly to the backend's `/convert-csv` endpoint, downloading the `.apkg` without the user ever seeing the CSV

## Features

- **Chrome Extension**: Works directly within the NotebookLM interface
- **Cloud-Powered**: Backend hosted on Google Cloud Run — no local setup needed
- **Download CSV**: Triggers NotebookLM's native download for your flashcard set
- **CSV to Anki**: Drop or browse any `.csv` flashcard file to get an Anki `.apkg`

## Installation

### Chrome Web Store

https://chromewebstore.google.com/detail/gfpdgeimnjeibphkimmeeigedjffdnnp?utm_source=item-share-cb

### Manual Installation (For Developers)

1. Clone the repository:
```bash
git clone https://github.com/Sahal03/flashcardConverter.git
cd flashcardConverter
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `extension` folder from the repository

5. The Flashcards Converter extension should now appear in your extensions list

That's it! By default, the extension connects to the cloud backend.

## Running the FastAPI Backend Locally

If you want to run or develop the backend server locally:

1. **Prerequisites**: Ensure you have Python 3.9+ installed.

2. **(Optional) Create and activate a virtual environment**:
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **Windows**:
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the local FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```
   *Note: By default, Uvicorn runs on `http://127.0.0.1:8000`. To point the extension at it, update `BACKEND_URL` in `extension/popup.js`.*

5. **Verify the local server**:
   - **Health Check**: Open `http://127.0.0.1:8000/` in your browser. You should receive `{"status":"healthy"}`.
   - **Interactive API Documentation (Swagger UI)**: Open `http://127.0.0.1:8000/docs` to test endpoints interactively.

## Usage

### Downloading CSV from NotebookLM

1. Open Google NotebookLM and navigate to your notebook with a flashcard set open

2. Click the Flashcards Converter extension icon in your Chrome toolbar

3. Click **Download CSV** — the extension will find and click NotebookLM's download button automatically, saving the `.csv` to your Downloads folder

### Converting CSV to Anki

1. Click the Flashcards Converter extension icon

2. In the **CSV to Anki (.apkg) Converter** panel, either:
   - **Drop** your `.csv` file onto the panel, or
   - **Click** the panel to open a file picker and browse to your file

3. The extension sends the file to the backend, which returns a ready-to-import `.apkg` file

### Importing to Anki

1. Open Anki desktop application

2. Go to **File → Import**

3. Select the generated `.apkg` file

4. Click "Import" to add your flashcards

## Output Formats

### CSV Format

The CSV file contains two columns:
- **Question**: The front of the flashcard
- **Answer**: The back of the flashcard

Perfect for:
- Viewing flashcards in Excel/Google Sheets
- Bulk editing
- Importing to other flashcard apps

### Anki Package Format

The `.apkg` file includes:
- All flashcards from your CSV
- Basic card template (front/back)
- Ready for immediate use in Anki

## Architecture

The project consists of two main components:

1. **Chrome Extension** (`/extension`): Frontend interface that integrates with NotebookLM and hosts the CSV-to-Anki converter panel
2. **Backend Server** (`main.py`): Python FastAPI server hosted on Google Cloud Run that parses CSV files and generates Anki packages via the `genanki` library

The cloud-hosted architecture means users don't need to install or run any backend services locally.

## Troubleshooting

**Download CSV does nothing**
- Make sure a flashcard set is open in NotebookLM (not just the notebook overview)
- Try clicking the button again — NotebookLM menus can take a moment to appear

**CSV to Anki conversion fails**
- Ensure the file is a valid `.csv` with two columns (question, answer)
- Check that the backend is reachable (or run locally if developing)

## Known Limitations

- Supports only Chrome/Chromium browsers
- Basic card template only

## Acknowledgments

- Google NotebookLM team for the AI-powered flashcard generation
- Anki community for the incredible spaced repetition platform
- [genanki](https://github.com/kerrickstaley/genanki) library for Anki package generation
- Google Cloud Platform for hosting infrastructure
