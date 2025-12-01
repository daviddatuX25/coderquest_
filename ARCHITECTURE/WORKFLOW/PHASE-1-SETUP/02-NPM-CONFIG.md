# 📦 PHASE 1.2 - NPM CONFIGURATION

**Duration:** 30 min  
**Goal:** Setup package.json with proper scripts  
**Prerequisites:** Phase 1.1 complete (npm install done)

---

## 🎯 What You're Doing Now

Making sure `package.json` has the right npm scripts so you can run:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview built project

---

## 📋 Checklist

### Step 1: View Current package.json (2 min)

```powershell
# Open package.json to see what's there
cat package.json
```

**Look for "scripts" section:**
```json
{
  "name": "coderquest",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    // This is what we're checking
  }
}
```

---

### Step 2: Check if Scripts Section Exists

**If you see "scripts" with dev/build/preview:**
→ You're good! Go to Step 4

**If "scripts" is missing or incomplete:**
→ Do Step 3 to add it

---

### Step 3: Update package.json (If Needed)

**If your package.json is missing scripts or looks wrong:**

Open file: `d:\Projects\coderquest_\package.json`

Find the `"scripts"` section and replace it with:

```json
{
  "name": "coderquest",
  "version": "1.0.0",
  "type": "module",
  "description": "2D RPG adventure game with React UI",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "phaser": "^3.55.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sass": "^1.69.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

**Save the file.**

---

### Step 4: Verify package.json Syntax (2 min)

After updating (or if it was already correct):

```powershell
# Check if JSON is valid
cat package.json | ConvertFrom-Json | Out-Null

# If no error, it's valid!
# If error, JSON has syntax issues - fix it
```

---

### Step 5: Check Vite Configuration (5 min)

Vite should have a config file. Check if `vite.config.js` exists:

```powershell
# Check if vite.config.js exists
ls vite.config.js

# If file exists, good!
# If not, create it with Step 6
```

---

### Step 6: Create vite.config.js (If Needed)

**If vite.config.js doesn't exist:**

Create file: `d:\Projects\coderquest_\vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true  // Auto-open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

**Save the file.**

---

### Step 7: Verify index.html Exists (3 min)

The entry point for your app:

```powershell
# Check if index.html exists
ls index.html

# Should show file exists
```

**If file doesn't exist, create it:**

Create file: `d:\Projects\coderquest_\index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoderQuest - RPG Learning Game</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        #app { width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/index.jsx"></script>
</body>
</html>
```

**Save the file.**

---

### Step 8: Check src/index.jsx Exists (3 min)

```powershell
# Check if src/index.jsx exists
ls src/index.jsx

# If not found, we'll create it in Phase 5
# For now, that's OK
```

---

### Step 9: Install Missing Dependencies (5 min)

If you updated package.json with new dependencies:

```powershell
# Update node_modules with new dependencies
npm install

# This adds any missing packages
# Should be quick since most are already there
```

---

### Step 10: Run a Test (Most Important!)

```powershell
# Try to start dev server
npm run dev

# Should see:
# VITE v5.0.0  ready in XX ms
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help
```

**Open browser to:** http://localhost:5173/

**You should see:**
- Either blank page (ok for now)
- Or error about missing React components (also ok)
- NO "connection refused" error

**If it works:**
- Press `Ctrl+C` to stop the dev server
- Continue to next step ✓

**If it fails:**
- See troubleshooting below

---

## 🚨 Troubleshooting

### ❌ "Command not found: npm run dev"
**Problem:** npm scripts not recognized
**Solution:** 
- Verify package.json has `"scripts"` section
- Verify JSON syntax is valid
- Run: `npm install` again
- Restart terminal

### ❌ "Cannot find module '@vitejs/plugin-react'"
**Problem:** Dependencies not installed
**Solution:**
- Run: `npm install`
- Wait for completion
- Try: `npm run dev` again

### ❌ "Port 5173 already in use"
**Problem:** Another app using that port
**Solution:**
- Check what's using port 5173: `netstat -ano | findstr :5173`
- Kill the process or use different port
- Or just wait a minute and try again

### ❌ "Connection refused when opening http://localhost:5173"
**Problem:** Dev server not running
**Solution:**
- Verify `npm run dev` is still running
- Check for errors in terminal
- If crashed, run: `npm run dev` again

### ❌ JSON syntax error in package.json
**Problem:** Typo in JSON
**Solution:**
- Check for missing commas
- Check for missing quotes
- Check for trailing commas
- Use JSON validator: https://jsonlint.com/

---

## ✨ What You've Accomplished

Once this phase completes:
- ✅ package.json has correct scripts
- ✅ vite.config.js is configured
- ✅ index.html entry point exists
- ✅ npm run dev works
- ✅ Dev server can start

---

## 📍 Next Step

After verifying `npm run dev` works:

**Go to:** `PHASE-1-SETUP/03-VERIFY-SETUP.md`

---

## ⏱️ Time Check

- Total time for this step: 20-30 minutes
- Most time is waiting for npm install
- Dev server start should be quick

---

## ✅ Done?

When you successfully run `npm run dev` and see dev server start:

**[✓] PHASE 1.2 Complete**

**Next:** `PHASE-1-SETUP/03-VERIFY-SETUP.md`

