let editor;

function initCodeMirror() {
    editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        mode: "text/x-c++src",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        extraKeys: {
            Tab: (cm) => {
                cm.replaceSelection("    ", "end");
            },
        },
    });

    editor.setSize("100%", "auto");
}

// Initialize CodeMirror
initCodeMirror();

// Function to handle compilation and execution using Judge0 API
async function compileAndRunCppCode(code) {
    const outputElement = document.getElementById("output");
    
    try {
        outputElement.textContent = "Submitting to Judge0 API...\n";
        
        const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'x-rapidapi-key': '318d2d6251msh1f9e7e5bbb57761p1f6e73jsn903a0c1d7308' // Replace with your Judge0 API key
            },
            body: JSON.stringify({
                source_code: code,
                language_id: 54 // Language ID for C++
            })
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Forbidden: Check your API key and permissions');
            } else if (response.status === 429) {
                throw new Error('Too Many Requests: You have hit the rate limit');
            } else {
                throw new Error('Failed to submit code to Judge0 API');
            }
        }

        const result = await response.json();

        if (result.status.id !== 3) { // Status ID 3 means the execution is successful
            throw new Error(`Execution failed: ${result.status.description}`);
        }

        return result.stdout || result.stderr;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

document.getElementById("compile-button").addEventListener("click", async () => {
    const outputElement = document.getElementById("output");
    const code = editor.getValue();

    // Clear previous output
    outputElement.textContent = "";
    outputElement.style.color = "";

    try {
        outputElement.textContent = "Compiling and running...\n";
        const output = await compileAndRunCppCode(code);
        outputElement.textContent += output;
    } catch (error) {
        outputElement.textContent += `\nError: ${error.message}`;
        outputElement.style.color = "#f44747";
    }
});

// Function to create C++ class with base code
function createCppClass(fileName) {
    const className = fileName.replace('.cpp', '');
    return `#include "${className}.h"

${className}::${className}() {
    // Constructor implementation
}

${className}::~${className}() {
    // Destructor implementation
}`;
}

// Function to create C++ header file with base code
function createCppHeader(fileName) {
    const headerGuard = fileName.replace('.h', '').toUpperCase() + '_H';
    return `#ifndef ${headerGuard}
#define ${headerGuard}

class ${fileName.replace('.h', '')} {
public:
    ${fileName.replace('.h', '')}();
    ~${fileName.replace('.h', '')}();

private:
    // Add private members here
};

#endif // ${headerGuard}`;
}

// File management functionality
document.getElementById("add-file").addEventListener("click", () => {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", (event) => {
    const fileList = document.getElementById("file-list");
    Array.from(event.target.files).forEach((file) => {
        const li = document.createElement("li");
        li.textContent = file.name;
        li.draggable = true;
        li.addEventListener("click", () => {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.setValue(e.target.result);
            };
            reader.readAsText(file);
        });
        fileList.appendChild(li);
    });
});

document.getElementById("create-file").addEventListener("click", () => {
    const fileName = prompt("Enter the name of the new file (include .cpp extension):");
    if (fileName) {
        if (!fileName.endsWith('.cpp')) {
            alert('File name must end with .cpp');
            return;
        }
        const fileList = document.getElementById("file-list");
        const li = document.createElement("li");
        li.textContent = fileName;
        li.draggable = true;
        li.addEventListener("click", () => {
            editor.setValue(
`#include <iostream>

int main() {
    // Your code here
    return 0;
}`
            );
        });
        fileList.appendChild(li);
    }
});

document.getElementById("create-cpp-class").addEventListener("click", () => {
    const fileName = prompt("Enter the name of the new C++ class (without .cpp extension):");
    if (fileName) {
        const className = fileName.replace(/[^a-zA-Z0-9]/g, '');
        if (!className) {
            alert('Invalid class name');
            return;
        }
        const fileList = document.getElementById("file-list");
        
        // Create .h file
        const headerLi = document.createElement("li");
        headerLi.textContent = `${className}.h`;
        headerLi.draggable = true;
        headerLi.addEventListener("click", () => {
            editor.setValue(createCppHeader(`${className}.h`));
        });
        fileList.appendChild(headerLi);

        // Create .cpp file
        const sourceLi = document.createElement("li");
        sourceLi.textContent = `${className}.cpp`;
        sourceLi.draggable = true;
        sourceLi.addEventListener("click", () => {
            editor.setValue(createCppClass(`${className}.cpp`));
        });
        fileList.appendChild(sourceLi);
    }
});

document.getElementById("create-cpp-header").addEventListener("click", () => {
    const fileName = prompt("Enter the name of the new header file (without .h extension):");
    if (fileName) {
        const headerName = fileName.replace(/[^a-zA-Z0-9]/g, '');
        if (!headerName) {
            alert('Invalid header name');
            return;
        }
        const fileList = document.getElementById("file-list");
        const li = document.createElement("li");
        li.textContent = `${headerName}.h`;
        li.draggable = true;
        li.addEventListener("click", () => {
            editor.setValue(createCppHeader(`${headerName}.h`));
        });
        fileList.appendChild(li);
    }
});

// UI Control functionality
document.getElementById("toggle-terminal").addEventListener("click", () => {
    const terminal = document.getElementById("terminal");
    if (terminal.style.display === "" || terminal.style.display === "none") {
        terminal.style.display = "flex";
    } else {
        terminal.style.display = "none";
    }
});

document.getElementById("close-terminal").addEventListener("click", () => {
    const terminal = document.getElementById("terminal");
    terminal.style.display = "none";
});

document.getElementById("close-sidebar").addEventListener("click", () => {
    const sidebar = document.getElementById("file-sidebar");
    sidebar.classList.add("hidden");
    updateEditorSize();
});

document.getElementById("toggle-sidebar").addEventListener("click", () => {
    const sidebar = document.getElementById("file-sidebar");
    sidebar.classList.toggle("hidden");
    updateEditorSize();
});

function updateEditorSize() {
    const sidebar = document.getElementById("file-sidebar");
    const editorTerminalContainer = document.getElementById("editor-terminal-container");
    if (sidebar.classList.contains("hidden")) {
        editorTerminalContainer.style.width = "100%";
    } else {
        editorTerminalContainer.style.width = "calc(100% - 250px)";
    }
}

// Resizing functionality
const resizer = document.getElementById('resizer');
const editorContainer = document.querySelector('.editor-container');
const terminal = document.querySelector('.output-container');

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
    });
});

function handleMouseMove(e) {
    if (!isResizing) return;

    const offset = e.clientY - editorContainer.getBoundingClientRect().top;
    const containerHeight = resizer.parentNode.getBoundingClientRect().height;

    if (offset < 50 || offset > containerHeight - 50) return;

    editorContainer.style.height = `${offset}px`;
    terminal.style.height = `${containerHeight - offset - resizer.offsetHeight}px`;
}