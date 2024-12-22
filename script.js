// script.js

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const showPreviewButton = document.getElementById('show-preview');
const themeSelector = document.getElementById('theme-selector');
const fontSizeSelector = document.getElementById('font-size-selector');
const downloadButton = document.getElementById('download-html');

// Render Markdown (only when button is clicked)
function renderMarkdown() {
  const markdownText = markdownInput.value;
  preview.innerHTML = marked.parse(markdownText);
}

// Theme Switcher
themeSelector.addEventListener('change', (e) => {
  document.body.className = `theme-${e.target.value}`;
});

// Font Size Adjuster
fontSizeSelector.addEventListener('change', (e) => {
  const fontSize = `${e.target.value}px`;
  markdownInput.style.fontSize = fontSize;
  preview.style.fontSize = fontSize;
});

// Show Preview on Button Click
showPreviewButton.addEventListener('click', renderMarkdown);

// Download HTML
downloadButton.addEventListener('click', () => {
  const blob = new Blob([preview.innerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-preview.html';
  a.click();
  URL.revokeObjectURL(url);
});
