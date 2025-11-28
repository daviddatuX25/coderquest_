# SASS Compilation Guide

## 📌 Overview

This project uses SASS (Syntactically Awesome StyleSheets) for better CSS organization and maintainability.

**SASS File**: `styles/main.scss`
**CSS Output**: `styles/main.css`

---

## 🔄 How SASS Works

### **SASS Hierarchy**
```
main.scss (entry point)
  ├── imports _variables.scss (colors, fonts, sizes)
  ├── imports _mixins.scss (reusable code blocks)
  ├── imports base/_reset.scss (CSS reset)
  ├── imports components/ (UI components)
  │   ├── _header.scss
  │   ├── _game-container.scss
  │   ├── _ui.scss
  │   └── _dialog.scss
  └── imports layouts/_responsive.scss (media queries)
```

When compiled, all these files merge into one `main.css`.

---

## 🛠️ Compilation Methods

### **Method 1: VS Code Live Sass Compiler** ⭐ EASIEST

**Step 1: Install Extension**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Live Sass Compiler"
4. Click Install (by Glenn Marks or Ritwick Dey)

**Step 2: Start Watching**
1. Open any `.scss` file from `styles/` folder
2. Look at bottom status bar
3. Click "Watch Sass" button
4. You'll see: "Sass Watching..."

**Step 3: Auto-Compilation**
- Whenever you save a `.scss` file, it automatically compiles to CSS
- `main.css` updates instantly
- Browser reloads and shows changes

### **Method 2: Command Line (Node.js)**

**Install SASS:**
```bash
npm install -g sass
```

**Watch Folder:**
```bash
cd c:\xampp\htdocs\CoderQuest
sass --watch styles:styles
```

**One-Time Compile:**
```bash
sass styles/main.scss styles/main.css
```

### **Method 3: Online Compiler**

Visit [sassmeister.com](https://www.sassmeister.com/)

1. Paste content from `styles/main.scss` in left panel
2. Get compiled CSS in right panel
3. Copy result to `styles/main.css`

---

## 📝 SASS Files Explained

### **1. `_variables.scss`** - Color & Size Settings
Defines all reusable values:
```scss
$primary-color: #00ff88;      // Main green
$text-color: #00ff88;
$font-primary: "Segoe UI", sans-serif;
$padding-md: 15px;
$z-dialog: 200;
```

### **2. `_mixins.scss`** - Reusable Code Blocks
Defines mixins (like CSS functions):
```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Usage in other files:
.dialog-box {
  @include flex-center;
}
```

### **3. `base/_reset.scss`** - CSS Reset
Removes browser defaults:
```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### **4. `components/` Folder** - UI Components
Each file styles one component:

**`_header.scss`** - Game title styling
**`_game-container.scss`** - Game wrapper & canvas
**`_ui.scss`** - Info panels
**`_dialog.scss`** - Dialog boxes & buttons

### **5. `layouts/_responsive.scss`** - Mobile/Tablet/Desktop
Handles different screen sizes:
```scss
@include mobile {     // ≤ 768px
  .game-info { display: none; }
}

@include desktop {    // ≥ 1025px
  .game-info { max-width: 300px; }
}
```

---

## 🎨 Editing SASS

### **Change Primary Color**

1. Open `styles/_variables.scss`
2. Find: `$primary-color: #00ff88;`
3. Change to new color: `$primary-color: #ff0088;`
4. Save file (auto-compiles if watching)
5. Refresh browser to see changes

### **Add New Variable**

In `styles/_variables.scss`:
```scss
// Add new color
$accent-color: #ffaa00;

// Add new size
$border-size: 5px;

// Add new timing
$transition-custom: 0.5s ease-in-out;
```

Then use in components:
```scss
.my-element {
  color: $accent-color;
  transition: all $transition-custom;
}
```

### **Create New Component File**

1. Create new file: `styles/components/_my-component.scss`
2. Add styles:
   ```scss
   .my-component {
     @include flex-center;
     background: $bg-dark;
     padding: $padding-md;
   }
   ```
3. Import in `main.scss`:
   ```scss
   @import 'components/my-component';
   ```
4. Save (auto-compiles)

### **Add Responsive Styles**

Use mixins in `_responsive.scss`:
```scss
.my-class {
  font-size: 16px;
  
  @include mobile {
    font-size: 12px;
  }
  
  @include tablet {
    font-size: 14px;
  }
}
```

---

## 🔍 Understanding Compilation

### **Before (SASS)**
```scss
$primary: #00ff88;

.dialog-box {
  @include flex-center;
  color: $primary;
  padding: $padding-md;
  
  @include mobile {
    display: none;
  }
}
```

### **After (CSS)**
```css
.dialog-box {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00ff88;
  padding: 15px;
}

@media (max-width: 768px) {
  .dialog-box {
    display: none;
  }
}
```

---

## ⚙️ Compilation Settings

### **VS Code Live Sass Settings**

Create `.vscode/settings.json` in project root:

```json
{
  "liveSassCompile.settings.formats": [
    {
      "format": "expanded",
      "extensionName": ".css",
      "savePath": "/styles/"
    }
  ],
  "liveSassCompile.settings.autoprefix": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

### **SASS CLI Options**

```bash
# Compressed output (smaller file size)
sass --style=compressed styles/main.scss styles/main.css

# Expanded output (more readable)
sass --style=expanded styles/main.scss styles/main.css

# Watch with options
sass --watch --style=compressed styles:styles
```

---

## 📊 File Sizes

| File | Size |
|------|------|
| main.scss | 2.5 KB |
| _variables.scss | 1.2 KB |
| _mixins.scss | 3.8 KB |
| base/_reset.scss | 0.8 KB |
| components/ (all) | 6.2 KB |
| layouts/_responsive.scss | 2.1 KB |
| **main.css (compiled)** | **12 KB** |

---

## 🐛 Troubleshooting

### **CSS Not Updating After SASS Save**

```
✓ Check "Watch Sass" button is active
✓ Check file path in console
✓ Try clicking "Stop Watching" then "Watch Sass" again
✓ Restart VS Code
✓ Hard refresh browser (Ctrl+F5)
```

### **Compilation Errors**

Check VS Code Output panel:
1. Click "Output" at bottom
2. Select "Live Sass Compiler" from dropdown
3. Check for error messages

Common errors:
- **"Cannot find module"** - Wrong import path
- **"Undefined variable"** - Variable not defined in _variables.scss
- **"Invalid mixin"** - Mixin not defined in _mixins.scss

### **Styles Apply But Don't Take Effect**

1. Hard refresh (Ctrl+Shift+R)
2. Clear cache (Ctrl+Shift+Del)
3. Check CSS file actually updated
4. Verify style selector is correct

---

## 🚀 Best Practices

### **Do's** ✅
- ✅ Use variables for all colors
- ✅ Use mixins to avoid repetition
- ✅ Group related selectors
- ✅ Use meaningful variable names
- ✅ Comment complex mixins
- ✅ Keep nesting shallow (max 3 levels)

### **Don'ts** ❌
- ❌ Don't edit main.css directly
- ❌ Don't hardcode colors (use variables)
- ❌ Don't nest more than 3 levels deep
- ❌ Don't create giant SCSS files
- ❌ Don't duplicate styles (use mixins)

### **Organization Tips**
```
// Good structure
.component {
  color: $primary;
  padding: $padding-md;
  
  &:hover {
    background: $primary;
  }
  
  @include mobile {
    padding: $padding-sm;
  }
}
```

---

## 📚 Resources

- **Official SASS Guide**: https://sass-lang.com/guide
- **SASS Documentation**: https://sass-lang.com/documentation
- **Live Sass Compiler**: https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass
- **SASS Playground**: https://www.sassmeister.com/

---

**Ready to compile!** Pick your preferred method and start developing. 🎨

Remember: Always save SCSS files to trigger compilation, then refresh browser to see changes!
