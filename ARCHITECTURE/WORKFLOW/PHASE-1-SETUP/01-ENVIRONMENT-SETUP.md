# ⚙️ PHASE 1.1 - ENVIRONMENT SETUP

**Duration:** 1 day  
**Goal:** Prepare development environment  
**Status:** Start here first

---

## 🎯 What You're Doing Today

Setting up your development environment so you can run `npm run dev` and see the game load in your browser.

```
Current State: Project files exist
                React components done
                But no dev server running

Goal State:    npm run dev works
               Browser opens to localhost
               Game UI loads
```

---

## ✅ Prerequisites

Before starting, verify you have:
- [ ] Node.js installed (`node --version` shows v16+)
- [ ] npm installed (`npm --version` shows v8+)
- [ ] Git installed (for commits)
- [ ] VS Code or code editor
- [ ] Access to `d:\Projects\coderquest_\`

---

## 📋 Checklist - Do These Steps

### Step 1: Check Node.js Installation (5 min)

```powershell
# In terminal, run:
node --version
npm --version

# Should show something like:
# v18.0.0
# 8.19.4
```

**If Node.js not installed:**
- Download from: https://nodejs.org/
- Install latest LTS version
- Restart your terminal after installing

---

### Step 2: Navigate to Project (2 min)

```powershell
# Go to your project folder
cd d:\Projects\coderquest_

# Verify you're in right place (should see package.json)
ls -la

# Should show: package.json, README.md, src/, etc.
```

---

### Step 3: Check Current package.json (5 min)

```powershell
# View current package.json
cat package.json

# Should show:
# - "name": "coderquest"
# - "version": "1.0.0"
# - "type": "module"
```

---

### Step 4: Check package.json Scripts (IMPORTANT!)

Open `package.json` in your editor and look at the `"scripts"` section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**If you don't see these scripts:**
→ Go to `PHASE-1-SETUP/02-NPM-CONFIG.md`

**If you see these scripts:**
→ Continue to Step 5

---

### Step 5: Install Dependencies (5-10 min)

```powershell
# Install all dependencies
npm install

# This will:
# - Create node_modules/ folder
# - Download all packages
# - May take 2-5 minutes
```

**Wait for it to complete!**

When done, should see:
```
added 1000+ packages in 2m
```

---

### Step 6: Verify Installation (3 min)

```powershell
# Check if dependencies installed
ls node_modules | wc -l

# Should show: 1000+ (many files)

# Check for key packages
ls node_modules | grep -E "vite|react|phaser"

# Should show:
# phaser
# react
# react-dom
# vite
# ... and others
```

---

### Step 7: Create .env File (Optional but recommended)

```powershell
# Create .env file in root
echo "VITE_APP_TITLE=CoderQuest" > .env

# Verify it was created
cat .env

# Should show:
# VITE_APP_TITLE=CoderQuest
```

---

### Step 8: Ready to Run! (2 min)

```powershell
# Everything is ready, verify one more time:
# ✅ Node.js installed
# ✅ npm installed
# ✅ In project directory
# ✅ npm install completed
# ✅ No errors in terminal

# You're ready for next step!
```

---

## 🚨 Troubleshooting

### ❌ "npm command not found"
**Solution:** Node.js/npm not installed
- Download from nodejs.org
- Install LTS version
- Restart terminal

### ❌ "Cannot find package.json"
**Solution:** Not in right directory
- Run: `cd d:\Projects\coderquest_`
- Run: `ls` to verify you see package.json

### ❌ "npm install fails"
**Solution:** Network or package issue
- Try: `npm cache clean --force`
- Then: `npm install` again
- If still fails, check internet connection

### ❌ "Permission denied"
**Solution:** Run terminal as administrator
- Right-click PowerShell → "Run as Administrator"
- Then run: `npm install` again

---

## ✨ What You've Accomplished

Once this step completes:
- ✅ Development environment is ready
- ✅ All dependencies installed
- ✅ npm commands will work
- ✅ Ready to start dev server

---

## 📍 Next Step

When all steps above are complete (npm install finished with no errors):

**Go to:** `PHASE-1-SETUP/02-NPM-CONFIG.md`

---

## ⏱️ Time Check

- Total time for this step: 15-20 minutes
- Mostly waiting for npm install
- Keep terminal open, move to next step

---

## 📝 Notes

- Keep `node_modules/` folder - it's needed for your project
- You only run `npm install` once (unless adding new packages)
- If adding packages later, use: `npm install package-name`
- Don't commit `node_modules/` to git (already in .gitignore)

---

## ✅ Done?

When `npm install` completes successfully:

**[✓] PHASE 1.1 Complete**

**Next:** `PHASE-1-SETUP/02-NPM-CONFIG.md`

