document.getElementById('exportAnki').addEventListener('click', async () => {  
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  try {
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id, allFrames: true},
      func: extractFlashcardsFromPage
    });
        
    let flashcards = null;
    for (let result of results) {
      if (result.result && result.result.length > 0) {
        flashcards = result.result;
        break;
      }
    }
    
    if (flashcards) {
      downloadAnki(flashcards);
    } else {
      alert("No flashcards found!");
    }
  } catch (error) {
    console.error("error:", error);
    alert("Error: " + error.message);
  }
});

document.getElementById('exportCsv').addEventListener('click', async () => {  
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  try {
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id, allFrames: true},
      func: extractFlashcardsFromPage
    });
        
    let flashcards = null;
    for (let result of results) {
      if (result.result && result.result.length > 0) {
        flashcards = result.result;
        break;
      }
    }
    
    if (flashcards) {
      downloadCSV(flashcards);
    } else {
      alert("No flashcards found!");
    }
  } catch (error) {
    console.error("error:", error);
    alert("Error: " + error.message);
  }
});

function extractFlashcardsFromPage() {
  const appRoot = document.querySelector('app-root');
  
  if (!appRoot || !appRoot.hasAttribute('data-app-data')) {
    return null;
  }
  
  const dataAttr = appRoot.getAttribute('data-app-data');
  const parser = new DOMParser();
  const decodedData = parser.parseFromString(dataAttr, 'text/html').body.textContent;
  const data = JSON.parse(decodedData);
  return data.flashcards;
}

function downloadCSV(flashcards) {
  let csv = 'Front,Back\n';
  flashcards.forEach(card => {
    const front = '"' + card.f.replace(/"/g, '""') + '"';
    const back = '"' + card.b.replace(/"/g, '""') + '"';
    csv += `${front},${back}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notebooklm-flashcards.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAnki(flashcards){
  fetch("https://flashcard-converter1-774031092485.us-central1.run.app/convert", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(flashcards)
  })
  .then(response => response.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notebooklm-flashcards.apkg';
    a.click();
    URL.revokeObjectURL(url);
  })
  .catch(error => console.error('Error:', error));
}