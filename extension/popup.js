const BACKEND_URL = "https://flashcard-converter1-774031092485.us-central1.run.app";

document.getElementById('exportCsv').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    world: 'MAIN',
    func: triggerNotebookLmCsvDownload
  });
});

const dropZone = document.getElementById('dropZone');
const dropStatus = document.getElementById('dropStatus');

function setStatus(msg, type = '') {
  dropStatus.textContent = msg;
  dropStatus.className = 'drop-status' + (type ? ' ' + type : '');
}

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (!file) return;
  await convertCsvFile(file);
});

document.getElementById('csvFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  await convertCsvFile(file);
  e.target.value = '';
});

async function convertCsvFile(file) {
  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    setStatus('Please select a .csv file.', 'error');
    return;
  }

  setStatus('Converting…', 'loading');

  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(`${BACKEND_URL}/convert-csv`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const apkgBlob = await response.blob();
    const url = URL.createObjectURL(apkgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.csv$/i, '') + '.apkg';
    a.click();
    URL.revokeObjectURL(url);

    setStatus('✓ Anki deck downloaded!', 'success');
  } catch (error) {
    console.error('Convert error:', error);
    setStatus('Error: ' + error.message, 'error');
  }
}

function triggerNotebookLmCsvDownload() {
  function clickDownloadInMenu() {
    const menuItems = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], .mat-mdc-menu-item, [role="menu"] button, [role="menu"] span, .cdk-overlay-container button, .cdk-overlay-container span'));
    const downloadItem = menuItems.find(el => {
      const txt = (el.textContent || '').trim().toLowerCase();
      return txt.includes('download') && !txt.includes('note') && !txt.includes('doc') && !txt.includes('share');
    });
    if (downloadItem) {
      downloadItem.click();
      return true;
    }
    return false;
  }

  const allButtons = Array.from(document.querySelectorAll('button, [role="button"], a, [role="menuitem"]'));
  const directBtn = allButtons.find(el => {
    const txt = (el.textContent || '').trim().toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const isDownload = txt === 'download set' || txt === 'download csv' || aria.includes('download set') || aria.includes('download flashcards');
    const isNoteOrDocsOrShare = txt.includes('note') || txt.includes('doc') || txt.includes('share') || txt.includes('create');
    return isDownload && !isNoteOrDocsOrShare;
  });

  if (directBtn) {
    directBtn.click();
    return;
  }

  if (clickDownloadInMenu()) return;

  const headerContainers = Array.from(document.querySelectorAll('.card-header-actions, [class*="card-header-actions"]'));

  headerContainers.sort((a, b) => {
    const aCard = a.closest('mat-card, [class*="card"], [class*="item"], div');
    const bCard = b.closest('mat-card, [class*="card"], [class*="item"], div');
    const aTxt = (aCard ? aCard.textContent : '').toLowerCase();
    const bTxt = (bCard ? bCard.textContent : '').toLowerCase();

    const aHasFlashcard = aTxt.includes('flashcard') || aTxt.includes('study guide');
    const bHasFlashcard = bTxt.includes('flashcard') || bTxt.includes('study guide');

    if (aHasFlashcard && !bHasFlashcard) return -1;
    if (!aHasFlashcard && bHasFlashcard) return 1;

    return b.getBoundingClientRect().left - a.getBoundingClientRect().left;
  });

  for (const container of headerContainers) {
    const btn = container.querySelector('button, [role="button"], mat-icon');
    if (btn) {
      (btn.closest('button') || btn).click();
      setTimeout(clickDownloadInMenu, 150);
      return;
    }
  }
}