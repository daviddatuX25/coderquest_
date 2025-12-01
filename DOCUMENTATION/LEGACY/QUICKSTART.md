# 🚀 Quick Start Guide - CoderQuest

## ⚡ 30-Second Start

1. Open: `http://localhost/CoderQuest/`
2. Wait for loading to complete
3. Use WASD to move
4. Press E near NPCs to talk
5. Click "Go to Quest" to access lessons

**That's it!** 🎮

---

## 🎮 Game Controls

```
┌─────────────────────────────┐
│  W/↑  = Move Up             │
│  A/←  = Move Left           │
│  S/↓  = Move Down           │
│  D/→  = Move Right          │
│  E    = Talk to NPCs        │
│  ESC  = Close Dialog        │
└─────────────────────────────┘
```

---

## 📍 Level Navigation

```
Level 1: Jungle Temple
    ↙ Walk left       Walk right ↘
Level 3: City Skyline ←→ Level 2: Town Center
    ↗ Walk right      Walk left ↖
```

- **Walk RIGHT**: Go to next level
- **Walk LEFT**: Go to previous level
- **Each level**: 3 unique NPCs

---

## 👥 All NPCs

### **Level 1: Jungle Temple** 🌴
- 🧙 **Mage** - Wisdom keeper
- ⚔️ **Knight** - Quest giver
- 🏹 **Archer** - Skill tester

### **Level 2: Town Center** 🏘️
- 🩺 **Healer** - Support specialist
- 🛒 **Merchant** - Item trader
- 📚 **Scholar** - Knowledge expert

### **Level 3: City Skyline** 🏙️
- ⚙️ **Engineer** - Tech creator
- 🔍 **Detective** - Mystery solver
- 🎨 **Artist** - Creative spirit

---

## 📝 SASS Customization (5 minutes)

### **Change Colors**

Edit `styles/_variables.scss`:

```scss
// Green to Purple
$primary-color: #aa00ff;
$primary-dark: #8800dd;

// Yellow to Orange
$secondary-color: #ffaa00;
```

Watch automatically recompiles CSS → Refresh browser.

### **Change Player Speed**

Edit `index.html`, find this line:
```javascript
const speed = 150;
```

Change to: `const speed = 200;` for faster movement

### **Change Loading Time**

Edit `index.html`, find:
```javascript
setTimeout(() => { hideLoadingScreen(); }, 500);
```

Change 500 to different milliseconds (e.g., 1000 = 1 second)

---

## 🎨 SASS Architecture (Quick View)

```
main.scss (entry)
    ├── Variables (colors, fonts)
    ├── Mixins (reusable code)
    ├── Base (CSS reset)
    ├── Components
    │   ├── Header
    │   ├── Game Container
    │   ├── UI Panels
    │   └── Dialogs
    └── Layouts (responsive)
```

**All compiled to**: `styles/main.css` ✅

---

## 💾 How to Compile SASS

### **Auto-Compile (Recommended)**
1. Install "Live Sass Compiler" in VS Code
2. Open any `.scss` file
3. Click "Watch Sass" (bottom status bar)
4. Edit → Auto-compiles → Refresh browser

### **Manual Compile**
```bash
# One-time compile
sass styles/main.scss styles/main.css
```

---

## 📁 Project Structure

```
CoderQuest/
├── index.html ..................... Main game (3 levels)
├── styles/
│   ├── main.scss .................. SASS entry point
│   ├── main.css ................... Compiled CSS ✅
│   ├── _variables.scss ............ Colors & sizes
│   ├── _mixins.scss ............... Reusable code
│   ├── components/ ................ UI components
│   │   ├── _header.scss
│   │   ├── _game-container.scss
│   │   ├── _ui.scss
│   │   └── _dialog.scss
│   ├── base/
│   │   └── _reset.scss
│   └── layouts/
│       └── _responsive.scss
├── assets/ ........................ Maps & sprites
│   ├── map1_jungle.tmj
│   ├── map2_town.tmj
│   ├── map3_city.tmj
│   └── characters/
│       └── npc1-10.png
├── Quest_level/ ................... Lessons & quests
├── README.md ...................... Full docs
├── SETUP_GUIDE.md ................. Setup guide
├── SASS_GUIDE.md .................. SASS guide
└── DEVELOPMENT_SUMMARY.md ......... This project
```

---

## 🎯 Features Overview

✅ **3 Complete Levels**
- Jungle Temple
- Town Center
- City Skyline

✅ **9 Interactive NPCs**
- Each with unique dialog
- Linked to quest system

✅ **Professional Loading**
- Animated spinner
- Progress bar
- Smooth transitions

✅ **Responsive Design**
- Mobile (≤768px)
- Tablet (768-1024px)
- Desktop (≥1024px)

✅ **SASS Architecture**
- 10 organized files
- Reusable variables
- Reusable mixins
- Easy to customize

---

## 🔍 Troubleshooting

### **Game won't load**
```
✓ XAMPP running? Check
✓ Right URL? http://localhost/CoderQuest/
✓ Check browser console (F12)
```

### **Styles look wrong**
```
✓ Hard refresh: Ctrl+F5
✓ Clear cache: Ctrl+Shift+Del
✓ Check main.css exists
```

### **Can't see NPCs**
```
✓ Check npc*.png files exist
✓ Move closer (press E)
✓ Check console for errors
```

### **Loading bar stuck**
```
✓ Check assets/ folder exists
✓ Check file paths in index.html
✓ Check browser console errors
```

---

## 📚 Documentation Files

- **README.md** - Full feature docs
- **SETUP_GUIDE.md** - Setup & customization
- **SASS_GUIDE.md** - Detailed SASS guide
- **DEVELOPMENT_SUMMARY.md** - Project overview

Read with: `Ctrl+K Ctrl+V` in VS Code

---

## 🎮 Adding a New Level

### **Step 1: Prepare Assets**
- Create Tiled map: `map4_castle.tmj`
- Add tileset: `castle_tileset.png` (optional)
- Add NPCs: `npc10.png`, `npc11.png`, etc.

### **Step 2: Edit index.html**

Find `LEVELS` array, add:
```javascript
{
  id: 4,
  name: 'Castle',
  map: 'map4_castle',
  tileset: 'castle_tileset',
  npcs: [
    { id: 10, name: 'Lord', x: 300, y: 200, sprite: 'npc10', 
      dialog: 'Welcome!' },
  ]
}
```

### **Step 3: Test**
- Upload assets
- Refresh game
- Walk right to Level 4

Done! 🎉

---

## 💡 Pro Tips

1. **Use Variables**: Change colors once in `_variables.scss` → Applies everywhere
2. **Use Mixins**: Avoid repeating CSS code
3. **Mobile First**: Design for mobile, then add desktop
4. **Test Often**: Refresh browser after SCSS changes
5. **Check Console**: Always check F12 console for errors

---

## 📞 Need Help?

**Check these files**:
- README.md - What features exist
- SETUP_GUIDE.md - How to set up
- SASS_GUIDE.md - How to compile
- DEVELOPMENT_SUMMARY.md - What was built

**Browser console** (F12):
- Shows loading progress
- Shows errors
- Shows game logs

**Common issues**:
- Not loading? → Check paths
- Styles wrong? → Hard refresh
- NPCs invisible? → Check sprites

---

## 🚀 Ready to Play!

```
1. Open: http://localhost/CoderQuest/
2. Wait for load
3. Play!
4. Customize SASS
5. Add new levels
6. Enjoy! 🎮
```

**Have fun!** 🌟

---

**Version**: 2.0
**Status**: ✨ Production Ready
**Last Updated**: November 28, 2025
