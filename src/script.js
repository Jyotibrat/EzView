// script.js

document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const showPreviewButton = document.getElementById('show-preview');
    const themeSelector = document.getElementById('theme-selector');
    const fontSizeSelector = document.getElementById('font-size-selector');
    const downloadHtmlButton = document.getElementById('download-html');
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadMdButton = document.getElementById('download-md');
    const downloadPngButton = document.getElementById('download-png');
    const downloadJpgButton = document.getElementById('download-jpg');

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
    downloadHtmlButton.addEventListener('click', (e) => {
        e.preventDefault();
        const blob = new Blob([preview.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-preview.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Download PDF
    downloadPdfButton.addEventListener('click', (e) => {
        e.preventDefault();
        const element = preview;
        const opt = {
            margin: 1,
            filename: 'markdown-preview.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Download Markdown
    downloadMdButton.addEventListener('click', (e) => {
        e.preventDefault();
        const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-preview.md';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Download PNG
    downloadPngButton.addEventListener('click', (e) => {
        e.preventDefault();
        html2canvas(preview).then(canvas => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'markdown-preview.png';
            a.click();
        });
    });

    // Download JPG
    downloadJpgButton.addEventListener('click', (e) => {
        e.preventDefault();
        html2canvas(preview).then(canvas => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.download = 'markdown-preview.jpg';
            a.click();
        });
    });
});
