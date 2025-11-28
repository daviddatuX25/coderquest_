# CoderQuest Documentation Generator

Generate organized Markdown documentation from React components and SCSS files, ready to convert to PDF.

## 📋 Overview

This tool collection automatically extracts all React components and SCSS styles from your CoderQuest project and creates beautifully organized Markdown documentation.

**Available in three languages:**
- **Node.js** - `generate-docs.js`
- **Python** - `generate-docs.py`
- **PowerShell** - `generate-docs.ps1`

## 🚀 Quick Start

### Option 1: Using PowerShell (Windows)

```powershell
# Run the script
.\generate-docs.ps1

# Or with custom output directory
.\generate-docs.ps1 -OutputDir "./documentation" -OutputFile "components.md"
```

### Option 2: Using Python (All Platforms)

```bash
# Run the script
python3 generate-docs.py

# Or with arguments (requires modification)
# python3 generate-docs.py
```

### Option 3: Using Node.js (All Platforms)

```bash
# Run the script
node generate-docs.js

# First time setup (if needed):
# npm install
```

## 📁 Output Structure

The scripts will generate:

```
docs/
├── CODERQUEST_COMPONENTS.md    (Main documentation file)
├── CODERQUEST_COMPONENTS.pdf   (After pandoc conversion)
└── ...
```

## 📄 Markdown Output Format

The generated markdown includes:

### 1. Table of Contents
- Quick navigation links to all sections
- Summary statistics

### 2. React Components Section
Each component includes:
- Component filename
- Full source code
- Import statements
- Props documentation (in comments)

```jsx
// Example format in markdown:
### 1. DialogBox.jsx

**Path:** `./src/components/DialogBox.jsx`

**Size:** 2,540 bytes

\`\`\`jsx
import React, { useState, useEffect } from 'react';
// ... full component code
\`\`\`
```

### 3. Custom Hooks Section
All custom hooks with full implementations

### 4. SCSS Files Section
All stylesheet files with syntax highlighting

### 5. Summary Statistics
- Total components count
- Total hooks count
- Total stylesheets count
- Generation timestamp

## 🔄 Converting to PDF

### Using Pandoc (Recommended)

**Installation:**

```bash
# On macOS
brew install pandoc

# On Windows (with Chocolatey)
choco install pandoc

# On Ubuntu/Debian
sudo apt install pandoc
```

**Convert to PDF:**

```bash
# Basic conversion
pandoc docs/CODERQUEST_COMPONENTS.md -o docs/CODERQUEST_COMPONENTS.pdf

# With styling and table of contents
pandoc docs/CODERQUEST_COMPONENTS.md \
  -o docs/CODERQUEST_COMPONENTS.pdf \
  --toc \
  --toc-depth=2 \
  --standalone \
  --pdf-engine=xelatex \
  -V geometry:margin=1in
```

### Using VS Code

1. Install "Markdown PDF" extension by yzane
2. Right-click on the markdown file
3. Select "Markdown PDF: Export (pdf)"

### Using Online Tools

- [Markdown to PDF Online](https://md2pdf.netlify.app/)
- [CloudConvert](https://cloudconvert.com/md-to-pdf)
- [Zamzar](https://www.zamzar.com/convert/md-to-pdf/)

## 📊 What Gets Documented

### React Components
```
src/components/
├── DialogBox.jsx
├── Lesson.jsx
├── QuestPopup.jsx
├── Quiz.jsx
├── MultipleChoiceQuestion.jsx
├── FillInBlanksQuestion.jsx
└── QuizResults.jsx
```

### Custom Hooks
```
src/hooks/
└── useGameEvents.js
```

### SCSS Stylesheets
```
src/styles/
├── _variables.scss
├── _mixins.scss
├── _dialog-box.scss
├── _quest-popup.scss
├── _lesson.scss
├── _quiz.scss
├── _multiple-choice.scss
├── _fill-in-blanks.scss
└── _quiz-results.scss
```

## 🔧 Customization

### PowerShell Script

Edit the parameters at the top:

```powershell
param(
    [string]$OutputDir = "./docs",           # Change output location
    [string]$OutputFile = "CODERQUEST_COMPONENTS.md"  # Change filename
)
```

### Python Script

Edit the config object:

```python
class DocGenerator:
    def __init__(self):
        self.output_dir = Path('./docs')     # Change here
        self.output_file = 'CODERQUEST_COMPONENTS.md'  # Change here
```

### Node.js Script

Edit the config object:

```javascript
const config = {
  outputDir: './docs',
  outputFile: 'CODERQUEST_COMPONENTS.md',
  srcDirs: {
    components: './src/components',
    hooks: './src/hooks',
    styles: './src/styles'
  }
};
```

## 📋 Usage Examples

### Generate Documentation and Convert to PDF

```bash
# PowerShell (Windows)
.\generate-docs.ps1
pandoc docs/CODERQUEST_COMPONENTS.md -o docs/CODERQUEST_COMPONENTS.pdf

# Bash (Linux/macOS)
python3 generate-docs.py
pandoc docs/CODERQUEST_COMPONENTS.md -o docs/CODERQUEST_COMPONENTS.pdf

# Node.js
node generate-docs.js
pandoc docs/CODERQUEST_COMPONENTS.md -o docs/CODERQUEST_COMPONENTS.pdf
```

### Generate in Custom Location

```powershell
# PowerShell
.\generate-docs.ps1 -OutputDir "./project-docs" -OutputFile "API.md"
```

## ✨ Features

- ✅ **Automatic extraction** of all components and styles
- ✅ **Organized structure** by type (components, hooks, styles)
- ✅ **Syntax highlighting** in markdown code blocks
- ✅ **File metadata** (path, size)
- ✅ **Statistics** (file counts, generation timestamp)
- ✅ **Cross-platform** (Windows, macOS, Linux)
- ✅ **Multiple languages** (PowerShell, Python, Node.js)
- ✅ **PDF-ready** (works with pandoc and online converters)

## 🐛 Troubleshooting

### PowerShell: "cannot be loaded because running scripts is disabled"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Python: "No module named 'pathlib'"

Update Python to 3.4+:
```bash
python3 --version
```

### Node.js: "Cannot find module 'fs'"

Node.js built-in module. Ensure you're running Node.js 12+:
```bash
node --version
```

### Pandoc not found

Ensure pandoc is installed and in your PATH:
```bash
pandoc --version
```

## 📝 Output Example

The generated markdown will look like:

```markdown
# CoderQuest - React Components & SCSS Documentation

**Generated:** 2024-01-15 14:30:45

## Table of Contents

- [React Components](#react-components)
- [Custom Hooks](#custom-hooks)
- [SCSS Styles](#scss-styles)
- [Summary](#summary)

---

## React Components

React components for the CoderQuest learning system.

### 1. DialogBox.jsx

**Path:** `./src/components/DialogBox.jsx`

**Size:** 2,540 bytes

\`\`\`jsx
import React, { useState, useEffect } from 'react';
// ... component code ...
\`\`\`

...

## Summary

**Total React Components:** 7

**Total Custom Hooks:** 1

**Total SCSS Files:** 9

**Total Files:** 17

**Generated:** 2024-01-15 14:30:45
```

## 🔗 Related Files

- `COMPONENT_SUMMARY.md` - Overview of components
- `docs/` - Generated documentation directory
- `src/components/` - Source components
- `src/hooks/` - Source custom hooks
- `src/styles/` - Source SCSS files

## 💡 Tips

1. **Run regularly** - Update documentation after each major change
2. **Version control** - Commit generated docs to git
3. **PDF distribution** - Share PDF with stakeholders
4. **Team documentation** - Print for team reference
5. **Archive** - Keep historical documentation versions

## 📞 Support

If you encounter issues:

1. Check that all source files exist in `src/` directory
2. Ensure proper file extensions (.jsx, .js, .scss)
3. Verify script execution permissions
4. Check file encoding (should be UTF-8)

## 📄 License

These scripts are part of the CoderQuest project.

---

**Last Updated:** 2024-01-15
