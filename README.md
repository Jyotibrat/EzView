# **MarkView**  

**MarkView** is a simple and user-friendly Markdown Previewer built to help users write and preview Markdown in real-time. This project is part of **Android Club Winter of Code 2024** and is open for contributions!  

---

## **Current Features**  
- **Live Markdown Editing**: Type your Markdown and preview the formatted content by clicking the "Show Preview" button.  
- **Customizable Themes**: Switch between different themes to style your preview.  
- **Download as HTML**: Save your Markdown preview as an HTML file.  
- **Integrated Code Editor**: Supports Java and Python coding with syntax highlighting.  
- **Real-time Code Execution**:  
  - **Python**: Runs using **Pyodide**, a WebAssembly port of Python for the browser.  
  - **Java**: Uses **Judge0 API** for compiling and executing Java code.  
- **Syntax Highlighting**: Provided using **CodeMirror**.  
- **Beginner-Friendly Codebase**: Aimed at fostering contributions from beginner-level developers.  

---

## **Technologies Used**  
- HTML5  
- CSS3  
- JavaScript  
- **Pyodide** : used for in-browser Python execution
- **Judge0 API** : used for Java execution
- **CodeMirror** : used for syntax highlighting
- **Marked JS** ([GitHub](https://github.com/markedjs/marked)) : for MarkDown
- GitHub Pages : used for Deployment  

---

## **Demo**  
Visit the live version of the project [here](https://jyotibrat.github.io/MarkView/).  

---

## **Project Structure**  
```plaintext
EzView
├── src
│   ├── assets/favicon
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── site.webmanifest
│   ├── java_ide
│   │   ├── java_ide.css
│   │   ├── java_ide.html
│   │   └── java_ide_script.js
│   ├── python_ide
│   │   ├── python_ide.css
│   │   ├── python_ide.html
│   │   └── py_script.js
│   ├── styles 
│   │   ├── about.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── file_upload.css
│   │   ├── footer.css
│   │   ├── themes.css
│   │   └── navbar.css
│   ├── about.html
│   ├── file_upload.html
│   ├── footer.html
│   ├── index.html
│   ├── navbar.html
│   ├── script.js
│   └── Readme.md
├── .github
│   ├── ISSUE_TEMPLATE 
│   └── workflows
│       └── pages.yml
├── LICENSE 
└── README.md
```

-Base.css has styles for index.html
-components has navbar and common components for index and others
-script.js has all the javascripts

## **Getting Started**

### Prerequisites
- Basic understanding of HTML, CSS, and JavaScript.
- A GitHub account for cloning and contributing to the repository.

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Jyotibrat/MarkView.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MarkView
   ```
3. Open the project in a browser:
   - Use any local server or open `index.html` directly in a browser.

---

## **How to Contribute**
We welcome contributions of all kinds! Here are some areas you can work on:

### **Contributors can be made**
- **Enhance Markdown Parsing**: Improve the parsing logic to support more Markdown syntax.
- **Add Themes**: Create new themes for the previewer.
- **Improve UI/UX**: Make the interface more visually appealing and user-friendly.
- **Bug Fixes**: Identify and fix any bugs in the project.

### **Steps to Contribute**
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a descriptive commit message"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## **Contact**
For any queries or suggestions, feel free to reach out:
- **GitHub**: [Jyotibrat](https://github.com/Jyotibrat)
- **Email**: jyotibratb@gmail.com

---

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Join us and make this project even better! Happy Coding and Stay Motivated!*

---
