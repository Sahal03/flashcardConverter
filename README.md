# NotebookLM Flashcard Exporter
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)  
A Chrome extension that exports flashcards from Google's NotebookLM directly to CSV and Anki packages.

## Overview

Flashcard Converter is a browser extension that seamlessly integrates with Google NotebookLM, allowing you to export your AI-generated flashcards with a single click. Convert your study materials to CSV format for easy viewing and editing, or export directly to Anki packages (.apkg) for spaced repetition learning.

The extension connects to a cloud-hosted backend on Google Cloud Run, so there's no local server setup required—just install the extension and start exporting!

<img width="301" height="171" alt="image" src="https://github.com/user-attachments/assets/c983042d-77fd-4251-a1e3-11e30a8a6e1a" />

## Features

- **Chrome Extension**: Works directly within NotebookLM interface
- **Cloud-Powered**: Backend hosted on Google Cloud Run—no local setup needed
- **Export to CSV**: Generate spreadsheet-friendly flashcard exports
- **Export to Anki**: Create ready-to-import Anki packages (.apkg files)

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

5. The Flashcard Converter extension should now appear in your extensions list

That's it! The extension will automatically connect to the cloud backend.

## Usage

### Exporting Flashcards from NotebookLM

1. Open Google NotebookLM and navigate to your notebook with flashcards

2. Generate or view your flashcards in NotebookLM

3. Click the Flashcard Converter extension icon in your Chrome toolbar

4. Choose your export format:
   - **CSV**: Creates a spreadsheet file with questions and answers
   - **Anki**: Generates an .apkg file for Anki import

### Importing to Anki

1. Open Anki desktop application

2. Go to **File → Import**

3. Select the generated `.apkg` file

4. Choose your target deck or create a new one

5. Click "Import" to add your flashcards

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

The .apkg file includes:
- All flashcards from your NotebookLM set
- Basic card template (front/back)
- Ready for immediate use in Anki

## Architecture

The project consists of two main components:

1. **Chrome Extension** (`/extension`): Frontend interface that integrates with NotebookLM
2. **Backend Server**: Python server hosted on Google Cloud Run that handles CSV and Anki package generation

The cloud-hosted architecture means users don't need to install or run any backend services locally.

## Troubleshooting

**Export download fails**
- Check browser download settings
- Ensure pop-ups aren't blocked for NotebookLM
- Try exporting again

## Known Limitations

- Supports only Chrome/Chromium browsers
- Basic card template only 

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google NotebookLM team for the AI-powered flashcard generation
- Anki community for the incredible spaced repetition platform
- [genanki](https://github.com/kerrickstaley/genanki) library for Anki package generation
- Google Cloud Platform for hosting infrastructure
