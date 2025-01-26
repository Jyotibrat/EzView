// script.js

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const showPreviewButton = document.getElementById('show-preview');
const fontSizeSelector = document.getElementById('font-size-selector');
const realTimeToggle = document.getElementById('real-time-toggle');
const spellCheckToggle = document.getElementById('spell-check-toggle');
let themeSelector;

// Utility: Debounce function for performance optimization (real-time preview)
function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function renderMarkdown() {
  const markdownText = markdownInput.value;
  console.log('Rendering markdown:', markdownText);
  try {
    preview.innerHTML = marked.parse(markdownText) || '<p>No content to preview</p>';
    console.log('Markdown rendered successfully');
  } catch (error) {
    console.log('Error rendering markdown:', error);
    preview.innerHTML = `<p style="color: red;">Error rendering markdown: ${error.message}</p>`;
  }
}

// Load the navbar dynamically
function loadNavbar() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      navbarPlaceholder.innerHTML = data;
      themeSelector = document.getElementById('theme-selector');
      attachThemeListener();
    })
    .catch(error => console.error('Error loading navbar:', error));
}

// Load the footer dynamically
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      footerPlaceholder.innerHTML = data;
      // Set current year in footer
      document.getElementById('year').textContent = new Date().getFullYear();
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Attach theme selector listener
function attachThemeListener() {
  if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
      console.log('Theme changed to', e.target.value);
      applyTheme(e.target.value);
    });
  }
}

function applyTheme(theme) {
  document.body.className = `theme-${theme}`;
  console.log('Applied theme:', theme);
}

// Adjust Font Size
function adjustFontSize(size) {
  const fontSize = `${size}px`;
  markdownInput.style.fontSize = fontSize;
  preview.style.fontSize = fontSize;
  console.log('Adjusted font size to', fontSize);
}

// Download Preview as HTML
function downloadPreview() {
  const blob = new Blob([preview.innerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-preview.html';
  a.click();
  URL.revokeObjectURL(url);
  console.log('Downloaded preview as HTML');
}

// Toggle Preview Mode (Real-Time vs Manual)
function togglePreviewMode(isRealTime) {
  if (isRealTime) {
    markdownInput.addEventListener('input', debouncedRenderMarkdown);
    showPreviewButton.style.display = 'none';
    console.log('Real-time preview enabled');
  } else {
    markdownInput.removeEventListener('input', debouncedRenderMarkdown);
    showPreviewButton.style.display = 'inline-block'; // Show manual preview button
    console.log('Manual preview enabled');
  }
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  console.log('Downloaded file:', filename);
}

function downloadAsHtml() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Preview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  ${preview.innerHTML}
</body>
</html>`;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadFile(blob, 'markdown-preview.html');
}

async function downloadAsPdf() {
  const element = document.createElement('div');
  element.innerHTML = preview.innerHTML;
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'markdown-preview.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    document.body.style.cursor = 'wait';
    await html2pdf().from(element).set(opt).save();
    document.body.style.cursor = 'default';
    console.log('Downloaded preview as PDF');
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
    document.body.style.cursor = 'default';
  }
}

function downloadAsMarkdown() {
  const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
  downloadFile(blob, 'markdown-content.md');
}

function attachEventListeners() {
  console.log('Attaching event listeners');
  showPreviewButton.addEventListener('click', () => {
    console.log('Show Preview button clicked');
    renderMarkdown();
  });

  if (fontSizeSelector) {
    fontSizeSelector.addEventListener('change', (e) => {
      console.log('Font size changed to', e.target.value);
      adjustFontSize(e.target.value);
    });
  }

  if (realTimeToggle) {
    realTimeToggle.addEventListener('change', (e) => {
      console.log('Real-time toggle changed to', e.target.checked);
      togglePreviewMode(e.target.checked);
    });
  }

  if (spellCheckToggle) {
    spellCheckToggle.addEventListener('click', () => {
      const currentState = markdownInput.spellcheck;
      console.log('Spell check toggled to', !currentState);
      markdownInput.spellcheck = !currentState;
      spellCheckToggle.classList.toggle('active');
      const value = markdownInput.value;
      markdownInput.value = '';
      markdownInput.value = value;
    });
  }

  const downloadHtmlButton = document.getElementById('download-html');
  if (downloadHtmlButton) {
    downloadHtmlButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Download HTML button clicked');
      downloadAsHtml();
    });
  }

  const downloadPdfButton = document.getElementById('download-pdf');
  if (downloadPdfButton) {
    downloadPdfButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Download PDF button clicked');
      await downloadAsPdf();
    });
  }

  const downloadMdButton = document.getElementById('download-md');
  if (downloadMdButton) {
    downloadMdButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Download Markdown button clicked');
      downloadAsMarkdown();
    });
  }
}

const debouncedRenderMarkdown = debounce(renderMarkdown, 200);

function initializeApp() {
  console.log('Initializing app');
  loadNavbar();
  loadFooter();
  attachEventListeners();
  // Apply default theme if themeSelector is not present initially
  applyTheme('light');
  adjustFontSize(fontSizeSelector ? fontSizeSelector.value : '18');
  togglePreviewMode(false);
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Get reference to the Clear button
const clearButton = document.getElementById('clear-markdown');

if (clearButton) {
  clearButton.addEventListener('click', () => {
    markdownInput.value = '';
    renderMarkdown();
    console.log('Clear button clicked, markdown input cleared');
  });
}