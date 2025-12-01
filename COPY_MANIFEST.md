# 📦 CODERQUEST - PROJECT COPY MANIFEST

**Purpose:** Copy this project to another location or new project

---

## ✅ WHAT TO COPY

### Essential (Required)
```
✅ src/                           All React components (built & ready)
✅ ARCHITECTURE/                  All workflow & system design (24 docs)
✅ DOCUMENTATION/                 All project docs (41 organized docs)
✅ styles/                        SCSS design system
✅ assets/                        Game assets (maps, characters, etc)
✅ public/                        Static files
✅ package.json                   Dependencies & npm scripts
✅ vite.config.js                 Vite build configuration
```

### Recommended (Helpful)
```
🔷 README.md                      Project overview
🔷 .git/                          Git history (if cloning)
```

### Optional (Reference)
```
⚪ Quest_level/                   Old quest level template
⚪ CoderQuest/                    Old CoderQuest version
⚪ docs/                          Old docs folder
```

### DO NOT COPY
```
❌ node_modules/                  (regenerate: npm install)
❌ .vite/                         (regenerate: npm run dev)
❌ *.html files in root           (generated, not needed)
❌ *.ps1, *.js files in root      (build utilities, not needed)
❌ DOCUMENTATION/LEGACY/          (archive, optional)
❌ .git/                          (for fresh start)
```

---

## 🚀 COPY COMMANDS

### Option 1: PowerShell (Complete Copy)
```powershell
# Copy to new project location
$source = "d:\Projects\coderquest_"
$dest = "D:\Projects\NewProjectName"

# Copy required folders
Copy-Item "$source\src" -Recurse -Destination "$dest\"
Copy-Item "$source\ARCHITECTURE" -Recurse -Destination "$dest\"
Copy-Item "$source\DOCUMENTATION" -Recurse -Destination "$dest\"
Copy-Item "$source\styles" -Recurse -Destination "$dest\"
Copy-Item "$source\assets" -Recurse -Destination "$dest\"
Copy-Item "$source\public" -Recurse -Destination "$dest\"

# Copy required files
Copy-Item "$source\package.json" -Destination "$dest\"
Copy-Item "$source\vite.config.js" -Destination "$dest\"
Copy-Item "$source\README.md" -Destination "$dest\"

# Initialize new project
cd "$dest"
npm install
npm run dev
```

### Option 2: PowerShell (Skip Legacy Docs)
```powershell
# Same as above, but skip LEGACY folder:
Copy-Item "$source\DOCUMENTATION\CORE" -Recurse -Destination "$dest\DOCUMENTATION\"
Copy-Item "$source\DOCUMENTATION\GUIDES" -Recurse -Destination "$dest\DOCUMENTATION\"
Copy-Item "$source\DOCUMENTATION\REFERENCE" -Recurse -Destination "$dest\DOCUMENTATION\"
Copy-Item "$source\DOCUMENTATION\README.md" -Destination "$dest\DOCUMENTATION\"
Copy-Item "$source\DOCUMENTATION\INDEX.md" -Destination "$dest\DOCUMENTATION\"
```

### Option 3: Manual Copy
1. Create new folder: `D:\Projects\NewProject`
2. Copy these folders:
   - `src/` from coderquest_
   - `ARCHITECTURE/` from coderquest_
   - `DOCUMENTATION/` from coderquest_
   - `styles/` from coderquest_
   - `assets/` from coderquest_
   - `public/` from coderquest_
3. Copy these files:
   - `package.json`
   - `vite.config.js`
   - `README.md`
4. Run: `npm install && npm run dev`

---

## 📋 COPY CHECKLIST

After copying, verify:

```
□ src/ folder exists with components/
□ ARCHITECTURE/ folder exists with WORKFLOW/
□ DOCUMENTATION/ folder exists with CORE/GUIDES/REFERENCE/
□ styles/ folder exists with SCSS files
□ assets/ folder exists with maps/ and characters/
□ package.json exists
□ vite.config.js exists

□ Run: npm install (completes without errors)
□ Run: npm run dev (starts dev server)
□ Open: http://localhost:5173/

□ Read: DOCUMENTATION/CORE/BUILD_CODERQUEST.md
□ Start: Phase 1 following ARCHITECTURE/WORKFLOW/PHASE-1-SETUP/
```

---

## 📐 COMPLETE DIRECTORY STRUCTURE

After copying and `npm install`, your new project will have:

```
NewProjectName/
├── src/
│   ├── components/
│   │   ├── DialogBox.jsx
│   │   ├── QuestPopup.jsx
│   │   ├── Lesson.jsx
│   │   ├── Quiz.jsx
│   │   ├── MultipleChoiceQuestion.jsx
│   │   ├── FillInBlanksQuestion.jsx
│   │   ├── QuizResults.jsx
│   │   ├── GameUI.jsx
│   │   └── README.md
│   ├── styles/
│   ├── hooks/
│   │   └── useGameEvents.js
│   ├── data/
│   │   └── sampleQuests.js
│   ├── GameUI.jsx
│   ├── App.jsx (to be created in Phase 2)
│   └── index.jsx (to be created in Phase 2)
│
├── ARCHITECTURE/
│   └── WORKFLOW/
│       ├── PHASE-1-SETUP/
│       ├── PHASE-2-CORE-ENGINE/
│       ├── PHASE-3-SYSTEMS/
│       ├── PHASE-4-DATA-LAYER/
│       ├── PHASE-5-INTEGRATION/
│       └── PHASE-6-TESTING/
│
├── DOCUMENTATION/
│   ├── CORE/
│   │   ├── BUILD_CODERQUEST.md
│   │   ├── BUILD_CHECKLIST.md
│   │   └── ... (6 core docs)
│   ├── GUIDES/
│   │   ├── QUICK_START.md
│   │   ├── SETUP_GUIDE.md
│   │   └── ... (11 guides)
│   ├── REFERENCE/
│   │   ├── ARCHITECTURE.md
│   │   └── ... (5 references)
│   ├── README.md
│   └── INDEX.md
│
├── styles/
│   ├── main.scss
│   ├── main.css
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── components/
│
├── assets/
│   ├── characters/
│   └── (maps and other assets)
│
├── public/
│   └── (static files)
│
├── node_modules/ (generated by npm install)
├── .vite/ (generated by npm run dev)
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── index.html
```

---

## 🔄 UPDATE STRATEGY

After copying:

### Follow the 6-Phase Workflow
Each phase builds on previous ones. Don't skip!

1. **Phase 1: Setup** (1-2 days)
   - Follow: ARCHITECTURE/WORKFLOW/PHASE-1-SETUP/README.md
   - Create: package.json npm scripts
   - Verify: environment setup

2. **Phase 2: Core Engine** (2-3 days)
   - Follow: ARCHITECTURE/WORKFLOW/PHASE-2-CORE-ENGINE/README.md
   - Create: GameScene.js, PlayerController.js
   - Create: App.jsx, index.jsx
   - Code templates provided in phase guide

3. **Phase 3-6: Systems, Data, Integration, Testing**
   - Follow each phase in order
   - Use templates provided
   - Reference DOCUMENTATION/ as needed

---

## 💡 TIPS

### For Quick Start
```
1. Copy everything (use Option 1 command)
2. cd NewProject
3. npm install
4. npm run dev
5. Open: DOCUMENTATION/CORE/BUILD_CODERQUEST.md
6. Start coding Phase 1
```

### For Clean Start (Skip Legacy)
```
Don't copy: DOCUMENTATION/LEGACY/ folder
It's optional - contains old build notes
```

### For Reference
```
Keep: DOCUMENTATION/REFERENCE/
These are technical references you'll need while building
```

### For Documentation
```
All docs are linked and cross-referenced
Use: DOCUMENTATION/INDEX.md to find anything
```

---

## 📝 FILES SUMMARY

| Folder | Purpose | Copy? |
|--------|---------|-------|
| src/ | React components (ready) | ✅ |
| ARCHITECTURE/ | Workflow & design (24 docs) | ✅ |
| DOCUMENTATION/ | All docs (41 organized) | ✅ |
| styles/ | SCSS design system | ✅ |
| assets/ | Maps, characters, sprites | ✅ |
| public/ | Static files | ✅ |
| node_modules/ | Dependencies | ❌ (regenerate) |
| .vite/ | Build cache | ❌ (regenerate) |
| Quest_level/ | Old version | ⚪ (optional) |
| CoderQuest/ | Old version | ⚪ (optional) |
| DOCUMENTATION/LEGACY/ | Archive | ⚪ (optional) |

---

## ✨ READY TO COPY!

Everything is organized and ready. Pick a copy command above and start your new project!

**Questions?** Read: DOCUMENTATION/CORE/BUILD_CODERQUEST.md

