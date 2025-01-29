// Define contentDiv at file scope
let contentDiv;

// Add event listener for file upload
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the file upload page
    const fileInput = document.getElementById('file');
    const isFileUploadPage = !!fileInput;

    if (!isFileUploadPage) return; // Exit if not on file upload page

    contentDiv = document.getElementById('content'); // Assign to the file-scope variable

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const markdown = reader.result;
                contentDiv.innerHTML = marked.parse(markdown);
            };
            reader.readAsText(file);
        }
    });

    // Get the button and footer elements
    let myBtn = document.getElementById("scrBtn");
    let footer = document.getElementById("footer-placeholder");

    // Show or hide the button based on scroll position and footer visibility
    window.onscroll = function () {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const footerPosition = footer.offsetTop - window.innerHeight;

        if (scrollPosition > 20 && scrollPosition < footerPosition) {
            myBtn.style.display = "block";
        } else {
            myBtn.style.display = "none";
        }
    };

    // Export functionality
    const downloadHtmlButton = document.getElementById('download-html');
    const downloadPdfButton = document.getElementById('download-pdf');

    if (downloadHtmlButton && isFileUploadPage) {
        downloadHtmlButton.addEventListener('click', (e) => {
            e.preventDefault();
            downloadAsHtml();
        });
    }

    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (downloadPdfButton.disabled) return;
            downloadPdfButton.disabled = true;
            await downloadAsPdf();
            downloadPdfButton.disabled = false;
        });
    }
});

// Scroll to the top of the page smoothly
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// Download functions
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
    if (!contentDiv) {
        contentDiv = document.getElementById('content');
    }
    if (!contentDiv) return; // Safety check

    const content = `
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
    ${contentDiv.innerHTML}
</body>
</html>`;
    const blob = new Blob([content], { type: 'text/html' });
    downloadFile(blob, 'markdown-preview.html');
}

async function downloadAsPdf() {
    try {
        if (!contentDiv) {
            contentDiv = document.getElementById('content'); // Fallback initialization
        }
        
        document.body.style.cursor = 'wait';
        
        // Create new jsPDF instance - updated syntax
        const doc = new jspdf.jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });

        // Set basic styles
        doc.setFont('helvetica');
        doc.setFontSize(12);
        
        const temp = document.createElement('div');
        temp.innerHTML = contentDiv.innerHTML;
        temp.style.cssText = `
            font-family: helvetica;
            font-size: 12pt;
            line-height: 1.5;
            padding: 20px;
        `;

        // Apply markdown styles
        const styles = `
            h1 { font-size: 24pt; margin: 20px 0; font-weight: bold; }
            h2 { font-size: 20pt; margin: 18px 0; font-weight: bold; }
            h3 { font-size: 16pt; margin: 16px 0; font-weight: bold; }
            p { margin: 12px 0; }
            code { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
            pre { background: #f5f5f5; padding: 10px; margin: 10px 0; }
            blockquote { border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0; }
            ul, ol { margin: 10px 0; padding-left: 20px; }
            li { margin: 5px 0; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        temp.appendChild(styleSheet);
        document.body.appendChild(temp);

        // Convert to PDF with applied styles
        await doc.html(temp, {
            callback: function(doc) {
                doc.save('markdown-export.pdf');
            },
            x: 15,
            y: 15,
            width: 180,
            windowWidth: 800
        });

        // Cleanup
        document.body.removeChild(temp);
        console.log('PDF generated successfully');
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        document.body.style.cursor = 'default';
    }
}
