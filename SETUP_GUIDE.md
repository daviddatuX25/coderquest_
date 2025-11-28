# CoderQuest - Setup & Documentation

## ✅ What's Been Implemented

### **1. CSS to SASS Conversion** ✨
All CSS has been converted to a modular SASS architecture:

```
styles/
├── main.scss (entry point)
├── main.css (compiled output)
├── _variables.scss (color, font, size variables)
├── _mixins.scss (reusable SASS mixins)
├── base/
│   └── _reset.scss (CSS reset)
├── components/
│   ├── _header.scss
│   ├── _game-container.scss
│   ├── _ui.scss
│   └── _dialog.scss
└── layouts/
    └── _responsive.scss
```

**Why SASS?**
- ✅ Variables for consistent theming
- ✅ Mixins for DRY (Don't Repeat Yourself) code
- ✅ Nested structure for better organization
- ✅ Easy to maintain and scale
- ✅ Better responsive design management

### **2. Three-Level Game System** 🎮

The game now features 3 complete levels:

#### **Level 1: Jungle Temple**
- Map: `map1_jungle.tmj`
- Tileset: `tf_jungle_tileset.png`
- NPCs: Mage, Knight, Archer

#### **Level 2: Town Center**
- Map: `map2_town.tmj`
- Tileset: `Serene_Village_16x16.png`
- NPCs: Healer, Merchant, Scholar

#### **Level 3: City Skyline**
- Map: `map3_city.tmj`
- Tileset: `Serene_Village_16x16.png`
- NPCs: Engineer, Detective, Artist

**Navigation:**
- Walk right edge → Next level
- Walk left edge → Previous level
- Each level has 3 unique NPCs to interact with

### **3. Professional Loading System** ⏳

The game now has a proper loading screen that shows:
- Animated spinner
- Progress bar (tracks asset loading)
- Status messages
- Smooth fade-out when ready

**Key Features:**
- Updates progress in real-time
- Shows current task being loaded
- Prevents game start until assets are ready
- Professional visual feedback

### **4. Fixed Game Loading Issues** 🐛

**Issues Fixed:**
- ✅ Game was stuck on the header
- ✅ Assets not loading properly
- ✅ No loading feedback
- ✅ Level transitions not working

**Solutions Implemented:**
- Proper Phaser initialization
- DOMContentLoaded event for safe startup
- Asset loading with progress tracking
- Dynamic level creation system

---

## 🚀 How to Use

### **Running the Game**
1. Make sure XAMPP is running
2. Open browser: `http://localhost/CoderQuest/`
3. Wait for loading screen to complete
4. Game starts automatically

### **Game Controls**
| Key | Action |
|-----|--------|
| W/A/S/D | Move |
| ↑↓←→ | Move (alternative) |
| E | Interact with NPCs |
| Escape | Close dialog |

### **Interacting with NPCs**
1. Get close to an NPC (yellow label appears)
2. Press E to open dialog
3. Click "Go to Quest" to start quest level
4. Click "Close" to dismiss dialog

---

## 🎨 Customizing SASS

### **Change Theme Colors**

Edit `styles/_variables.scss`:

```scss
$primary-color: #00ff88;        // Main green
$primary-dark: #00dd77;         // Darker green
$secondary-color: #ffff00;      // Yellow
$bg-dark: #0d1b2a;              // Dark blue
```

Then recompile CSS (done automatically if using Live Sass Compiler).

### **Add New Mixins**

Add to `styles/_mixins.scss`:

```scss
@mixin my-custom-style {
  border: 2px solid $primary-color;
  border-radius: $border-radius;
  padding: $padding-md;
}
```

### **Responsive Design**

The project uses three breakpoints in `_responsive.scss`:

```scss
@include mobile {    // ≤ 768px
  // Mobile styles
}

@include tablet {    // 769px - 1024px
  // Tablet styles
}

@include desktop {   // ≥ 1025px
  // Desktop styles
}
```

---

## 📦 Adding New Levels

To add Level 4 (Sky Castle):

### **Step 1: Prepare Assets**
- Create new Tiled map: `map4_sky.tmj`
- Create tileset: `sky_tileset.png` (if needed)
- Add NPC sprites: `npc10.png`, etc.

### **Step 2: Update LEVELS Array**

In `index.html`, add to the `LEVELS` array:

```javascript
{
  id: 4,
  name: 'Sky Castle',
  map: 'map4_sky',
  tileset: 'sky_tileset',
  npcs: [
    { id: 10, name: 'DragonLord', x: 300, y: 200, sprite: 'npc10', 
      dialog: 'Welcome to my castle!' },
    // ... more NPCs
  ]
}
```

### **Step 3: Add Assets**
- Place map files in `assets/`
- Place sprites in `assets/characters/`

That's it! Game automatically loads new level.

---

## 🔧 Compilation Methods

### **Method 1: Live Sass Compiler (VS Code)**
1. Install extension "Live Sass Compiler"
2. Open any `.scss` file
3. Click "Watch Sass" button (bottom status bar)
4. CSS auto-compiles when you save

### **Method 2: Command Line**
```bash
# Install SASS
npm install -g sass

# Watch styles folder
sass --watch styles:styles

# One-time compile
sass styles/main.scss styles/main.css
```

### **Method 3: Online SASS Compiler**
Visit [sassmeister.com](https://www.sassmeister.com/)
Copy from `styles/main.scss` and paste output to `main.css`

---

## 📊 Project Structure

```
CoderQuest/
├── index.html                 # Main game file
├── styles/
│   ├── main.scss             # SASS entry
│   ├── main.css              # Compiled CSS
│   ├── _variables.scss       # Variables
│   ├── _mixins.scss          # Mixins
│   ├── base/
│   │   └── _reset.scss
│   ├── components/
│   │   ├── _header.scss
│   │   ├── _game-container.scss
│   │   ├── _ui.scss
│   │   └── _dialog.scss
│   └── layouts/
│       └── _responsive.scss
├── assets/
│   ├── *.tmj                 # Tiled maps
│   ├── *.png                 # Tilesets
│   └── characters/
│       └── npc*.png          # NPC sprites
├── Quest_level/
│   ├── index.html            # Quest page
│   └── src/
│       ├── css/
│       ├── js/
│       └── scss/
└── README.md
```

---

## 🎯 Game Features Summary

✅ **3 Complete Levels**
- Jungle Temple, Town Center, City Skyline
- Smooth level transitions
- Unique NPCs in each level

✅ **NPC Interaction System**
- 9 total NPCs across all levels
- Dialog boxes with quest integration
- Proximity-based interaction (Press E)

✅ **Professional UI**
- Loading screen with progress
- Info panel (controls, level, NPC count)
- Level indicator
- Dialog system
- Responsive design

✅ **Modern Styling**
- SASS architecture
- Neon cyberpunk theme
- Glowing effects
- Smooth animations
- Mobile responsive

✅ **Audio-Visual Polish**
- Animated spinner
- Glowing text effects
- Smooth transitions
- Color-coded UI

---

## 🐛 Troubleshooting

### **Game Doesn't Load**
```
✓ Check XAMPP is running
✓ Verify URL is http://localhost/CoderQuest/
✓ Open DevTools (F12) and check Console
✓ Look for asset loading errors
```

### **Styles Not Applied**
```
✓ Clear browser cache (Ctrl+Shift+Del)
✓ Hard refresh (Ctrl+F5)
✓ Check main.css exists in styles/
✓ Verify styles/main.css is linked in HTML
```

### **NPCs Not Visible**
```
✓ Check NPC sprite files exist
✓ Verify filenames: npc1.png, npc2.png, etc.
✓ Check NPC coordinates are in valid range
```

### **Level Transitions Don't Work**
```
✓ Walk to the right edge of the map
✓ Check map files are loaded (F12 Console)
✓ Verify LEVELS array in index.html
```

---

## 📞 Support Resources

- **Phaser Docs**: https://photonstorm.github.io/phaser3-docs/
- **SASS Guide**: https://sass-lang.com/guide
- **Tiled Editor**: https://www.mapeditor.org/
- **MDN Web Docs**: https://developer.mozilla.org/

---

**Version**: 2.0
**Last Updated**: November 28, 2025
**Status**: ✅ Ready for Production
