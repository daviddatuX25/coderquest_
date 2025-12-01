# PHASE 1: SETUP

**Duration:** 1-2 days  
**Effort:** Low (mostly following guides)  
**Complexity:** Simple (verification and configuration)  
**Goal:** Ready development environment that can run Vite + Phaser + React

---

## 📋 Phase 1 Overview

This phase is about **verification and configuration**. You already have:
- ✅ Node.js (hopefully)
- ✅ npm (comes with Node.js)
- ✅ package.json with dependencies
- ✅ React components built
- ✅ SCSS styling done

What we need to do:
- 🔄 Verify Node.js is installed
- 🔄 Verify npm is working
- 🔄 Verify dependencies can install
- 🔄 Setup npm scripts for development
- 🔄 Test that Vite dev server starts
- 🔄 Test that game can initialize

---

## 🎯 Success Criteria

By end of Phase 1, you should be able to:

1. Run `npm install` without errors
2. Run `npm run dev` and see Vite start
3. Open http://localhost:5173 in browser
4. See "CoderQuest - Loading..." or similar message
5. Open browser console (F12) and see no errors
6. Press Ctrl+C to stop server

If all 6 are true → **Phase 1 complete!** ✅

---

## 📁 Phase 1 Files

```
PHASE-1-SETUP/
├── 01-ENVIRONMENT-SETUP.md ......... Environment verification
├── 02-NPM-CONFIG.md ............... package.json setup
├── 03-VERIFY-SETUP.md ............ Final verification
└── README.md ..................... This file
```

---

## 🗺️ Phase 1 Workflow

```
START: You have project folder
  ↓
STEP 1: Follow 01-ENVIRONMENT-SETUP.md
  ├─ Verify Node.js is installed
  ├─ Verify npm is installed
  └─ Check npm version
  ↓
STEP 2: Follow 02-NPM-CONFIG.md
  ├─ Verify package.json structure
  ├─ Install dependencies (npm install)
  └─ Setup vite.config.js
  ↓
STEP 3: Follow 03-VERIFY-SETUP.md
  ├─ Run npm run dev
  ├─ Open browser
  ├─ Check console
  └─ Test game initializes
  ↓
END: Phase 1 complete! ✅
```

---

## ⏱️ Time Breakdown

| Step | File | Duration | What You Do |
|------|------|----------|------------|
| 1 | 01-ENVIRONMENT-SETUP.md | 15-20 min | Verify tools |
| 2 | 02-NPM-CONFIG.md | 20-30 min | Install packages |
| 3 | 03-VERIFY-SETUP.md | 20 min | Test everything |
| **Total** | **All 3** | **1 hour** | **Setup complete** |

---

## 🚀 Quick Start (TL;DR)

If you're experienced:

```powershell
# Navigate to project
cd d:\Projects\coderquest_

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# → localhost:5173
# → Press F12 to open console
# → Should see no red errors
```

If anything fails → Follow the detailed guides below.

---

## 📖 Detailed Guide Order

**Follow in this order:**

1. **01-ENVIRONMENT-SETUP.md**
   - Takes 15 min
   - Verifies Node.js and npm
   - If this fails, you can't continue

2. **02-NPM-CONFIG.md**
   - Takes 20-30 min
   - Installs all dependencies
   - Sets up build scripts
   - If this fails, check Node.js version

3. **03-VERIFY-SETUP.md**
   - Takes 20 min
   - Tests dev server
   - Checks browser loads
   - If this fails, check Step 2

---

## ❌ Common Issues in Phase 1

### "Node.js not found"
→ Follow 01-ENVIRONMENT-SETUP.md step 1

### "npm ERR!..."
→ Usually npm version issue
→ Run `npm install -g npm@latest`

### "Port 5173 already in use"
→ Either stop other dev server or run `npm run dev -- --port 5174`

### "Cannot find module..."
→ Dependency didn't install properly
→ Delete `node_modules` folder
→ Run `npm install` again

### "Vite config not found"
→ Make sure `vite.config.js` is in root folder
→ See 02-NPM-CONFIG.md for template

---

## 🎓 What You'll Learn

### Understanding npm
- How `package.json` defines project
- How dependencies are installed
- How npm scripts work

### Understanding Vite
- How dev server works
- How hot reload works
- Where to put config

### Verification Skills
- How to check tools are installed
- How to read error messages
- How to debug setup issues

---

## 🔗 Related Documentation

**Need quick reference?**
→ See `QUICK_REFERENCE.md` in root

**Need to understand project structure?**
→ See `ARCHITECTURE/01-FOUNDATION/PROJECT_STRUCTURE.md`

**Need npm help?**
→ See `ARCHITECTURE/WORKFLOW/PHASE-1-SETUP/02-NPM-CONFIG.md`

---

## ⚠️ Pre-Phase 1 Checklist

Before starting Phase 1, make sure:

- [ ] You have `package.json` file
- [ ] You have `src/` folder with React components
- [ ] You have internet connection (to download dependencies)
- [ ] You have Administrator access (to install globally if needed)
- [ ] You have ~500MB free disk space (for node_modules)

If any of these is missing → You're in wrong project or workspace

---

## 🎉 Phase 1 Complete!

When you've completed all 3 steps:

1. ✅ Node.js and npm verified
2. ✅ Dependencies installed
3. ✅ Dev server running
4. ✅ Game initializes in browser

**Next:** Go to `PHASE-2-CORE-ENGINE/README.md`

---

## 📞 Stuck?

Each step file has:
- Detailed instructions
- Expected output
- Troubleshooting section
- What to do if something fails

**Read the step file carefully first.**

If still stuck:
1. Check troubleshooting section
2. Check that previous step worked
3. Try fresh start: delete node_modules and run `npm install` again

---

## 🎬 Ready?

**Start here:** `01-ENVIRONMENT-SETUP.md`

**Go!** ▶️

