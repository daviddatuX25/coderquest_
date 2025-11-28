# CoderQuest - 2D RPG Adventure

## 🎮 Game Features

### **Multi-Level System**
- **Level 1**: Jungle Temple - Explore ancient ruins with the Mage, Knight, and Archer
- **Level 2**: Town Center - Visit the bustling town with the Healer, Merchant, and Scholar
- **Level 3**: City Skyline - Explore the modern city with the Engineer, Detective, and Artist

### **Core Gameplay**
- ✅ Walk around expansive 2D maps
- ✅ Interact with NPCs (Press E)
- ✅ Quest integration system
- ✅ Seamless level transitions at map edges
- ✅ 9 unique NPCs across 3 levels
- ✅ Smooth camera following

### **Controls**
| Action | Input |
|--------|-------|
| Move | WASD or Arrow Keys |
| Interact | E |
| Close Dialog | Escape |

## 🎨 SASS Architecture

The project uses a modular SASS structure for better maintainability and scalability.

### **Directory Structure**
```
styles/
├── main.scss           # Main entry point (imports all partials)
├── main.css            # Compiled CSS (auto-generated)
├── _variables.scss     # Color, font, and size variables
├── _mixins.scss        # Reusable SCSS mixins
├── base/
│   └── _reset.scss     # CSS reset and base styles
├── components/
│   ├── _header.scss    # Header styling
│   ├── _game-container.scss  # Game wrapper and canvas
│   ├── _ui.scss        # Info panels and stats
│   └── _dialog.scss    # Dialog boxes and buttons
└── layouts/
    └── _responsive.scss # Media queries and responsive design
```

### **SASS Features Used**

#### **Variables** (_variables.scss)
- Color palette (primary, secondary, backgrounds)
- Typography (fonts)
- Dimensions (padding, border-radius)
- Z-index management
- Transition timing

#### **Mixins** (_mixins.scss)
- Flexbox utilities (flex-center, flex-column)
- Gradient backgrounds
- Button styling
- Border with glow effects
- Text glows
- Responsive breakpoints (mobile, tablet, desktop)
- Animations (fade-in, slide-up)

#### **Components**
- Modular component styling
- Header with glow effects
- Game container with loading screen
- UI panels with borders and shadows
- Interactive dialog boxes
- Button variants

#### **Responsive Design** (_responsive.scss)
- Mobile-first approach
- Breakpoints:
  - Mobile: ≤ 768px
  - Tablet: 769px - 1024px
  - Desktop: ≥ 1025px
- Landscape orientation handling

## 🚀 How to Compile SASS

You have two options:

### **Option 1: Using VS Code Extension**
1. Install "Live Sass Compiler" extension
2. Click "Watch Sass" button
3. Changes auto-compile to `main.css`

### **Option 2: Using Node.js/SASS CLI**
```bash
# Install SASS
npm install -g sass

# Watch for changes
sass --watch styles:styles
```

## 📦 Loading System

The game features a professional loading screen with:
- Animated spinner
- Progress bar showing asset loading
- Loading status text
- Smooth transition to game

## 🎯 Level System

Each level is defined in the `LEVELS` array:
```javascript
{
  id: 1,
  name: 'Jungle Temple',
  map: 'map1_jungle',           // Tiled map file
  tileset: 'tf_jungle_tileset', // Tileset image
  npcs: [...]                   // NPC array
}
```

### **Adding New Levels**
1. Create a new Tiled map and add it to `assets/`
2. Add tileset image if needed
3. Add level definition to `LEVELS` array
4. Add NPC sprites to `assets/characters/`

## 🎮 Game Architecture

### **Phaser 3 Scene Structure**
- **preload()**: Loads all assets with progress tracking
- **create()**: Initializes the first level and input
- **createLevel()**: Dynamically loads maps and NPCs
- **update()**: Handles player movement and level transitions

### **NPC System**
- Each NPC has collision zone for interaction
- NPCs display floating labels
- Dialog system with quest integration

## 🔧 Customization

### **Change Colors**
Edit `styles/_variables.scss`:
```scss
$primary-color: #00ff88;
$secondary-color: #ffff00;
```

### **Adjust Player Speed**
In `index.html`, find the update function:
```javascript
const speed = 150; // Change this value
```

### **Modify Loading Time**
In `index.html`, adjust loading screen delay:
```javascript
setTimeout(() => {
  hideLoadingScreen();
}, 500); // Milliseconds
```

## 📱 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 File Sizes

- `index.html`: ~18 KB
- `styles/main.css`: ~12 KB
- All SCSS files: ~8 KB (combined)

## 🐛 Troubleshooting

### **Game stuck on loading**
- Check browser console for errors (F12)
- Verify all asset paths are correct
- Ensure assets folder structure matches

### **NPCs not appearing**
- Check NPC sprite filenames match in `assets/characters/`
- Verify NPC coordinates are within map bounds

### **Styles not applying**
- Ensure `styles/main.css` is linked in HTML
- Clear browser cache (Ctrl+Shift+Del)
- Recompile SCSS if changes aren't showing

## 📚 Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Tiled Map Editor](https://www.mapeditor.org/)
- [SASS Documentation](https://sass-lang.com/)

---

**Created with ❤️ for CoderQuest**
