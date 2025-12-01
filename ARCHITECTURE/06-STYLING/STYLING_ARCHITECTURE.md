# 🎨 SCSS Styling Architecture

**Purpose:** Organize and manage all component styles  
**Approach:** Modular component-scoped SCSS  
**Status:** All files already created, this is documentation

---

## 📋 Overview

SCSS is organized into:
- **Variables** - Colors, fonts, spacing, sizing
- **Mixins** - Reusable style patterns
- **Components** - Component-specific styles
- **Base** - Global styles and resets

```
styles/
├── main.scss                # Entry point (imports all)
├── main.css                 # Compiled output
├── _variables.scss          # Design tokens
├── _mixins.scss             # Reusable patterns
├── base/
│   └── _reset.scss          # CSS reset
├── components/
│   ├── _header.scss
│   ├── _game-container.scss
│   ├── _ui.scss
│   └── _dialog.scss
└── layouts/
    └── _responsive.scss
```

And in `src/styles/`:
```
src/styles/
├── index.scss               # Main entry
├── _variables.scss          # Design tokens
├── _mixins.scss             # Patterns
├── _dialog-box.scss         # DialogBox component
├── _quest-popup.scss        # QuestPopup component
├── _quiz.scss               # Quiz component
├── _multiple-choice.scss    # MCQ component
├── _fill-in-blanks.scss     # Fill-in component
└── _quiz-results.scss       # Results component
```

---

## 🎨 Design Tokens (_variables.scss)

### Colors

**Primary Brand Colors:**
```scss
$color-primary: #3b82f6;           // Blue (main brand)
$color-primary-dark: #1e40af;      // Darker blue
$color-primary-light: #dbeafe;     // Light blue background
```

**Status Colors:**
```scss
$color-success: #10b981;           // Green (pass)
$color-error: #ef4444;             // Red (fail)
$color-warning: #f59e0b;           // Amber (caution)
$color-info: #0ea5e9;              // Sky blue (info)
```

**Backgrounds:**
```scss
$color-bg-dark: #0d1b2a;           // Very dark (game bg)
$color-bg-darker: #1e3a5f;         // Darker
$color-bg-light: #f8fafc;          // Light (modal bg)
```

**Text:**
```scss
$color-text-primary: #1f2937;      // Dark text
$color-text-secondary: #6b7280;    // Gray text
$color-text-light: #e0eaff;        // Light text
```

### Typography

**Fonts:**
```scss
$font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'Courier New', monospace;
```

**Sizes:**
```scss
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;
```

**Usage:**
```scss
h1 { font-size: $font-size-2xl; }
p { font-size: $font-size-base; }
small { font-size: $font-size-sm; }
```

### Spacing Scale

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

**Usage:**
```scss
.card {
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    gap: $spacing-sm;
}
```

### Border Radius

```scss
$radius-sm: 4px;     // Small buttons
$radius-md: 8px;     // Cards
$radius-lg: 12px;    // Modals
$radius-xl: 16px;    // Large elements
$radius-full: 9999px; // Circles
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Transitions

```scss
$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;
```

### Z-Index Layers

```scss
$z-background: 0;
$z-dropdown: 100;
$z-sticky: 500;
$z-fixed: 1000;
$z-modal-backdrop: 2000;
$z-modal: 2001;
$z-tooltip: 3000;
```

---

## 🔧 Mixins (_mixins.scss)

### Flexbox Utilities

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}
```

**Usage:**
```scss
.dialog-header {
    @include flex-between;  // Items spread apart
}

.modal-container {
    @include flex-center;   // Items centered
}
```

### Button Reset

```scss
@mixin button-reset {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
```

**Usage:**
```scss
.close-btn {
    @include button-reset;
    // Now it's a clean button without default styling
}
```

### Focus Ring (Accessibility)

```scss
@mixin focus-ring {
  outline: 2px solid $color-primary;
  outline-offset: 2px;
}
```

**Usage:**
```scss
button {
    &:focus-visible {
        @include focus-ring;
    }
}
```

### Responsive Breakpoints

```scss
@mixin mobile-only {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet-only {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop-only {
  @media (min-width: 1025px) {
    @content;
  }
}
```

**Usage:**
```scss
.container {
    width: 100%;
    
    @include mobile-only {
        padding: $spacing-sm;
    }
    
    @include desktop-only {
        max-width: 1200px;
        padding: $spacing-lg;
    }
}
```

### Text Utilities

```scss
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@mixin gradient-text($from, $to) {
  background: linear-gradient(90deg, $from 0%, $to 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Usage:**
```scss
.card-title {
    @include truncate;  // Single line with ellipsis
}

.description {
    @include line-clamp(3);  // 3 lines max
}

.gradient-heading {
    @include gradient-text($color-primary, $color-secondary);
}
```

### Smooth Transitions

```scss
@mixin smooth-transition($properties: all, $duration: $transition-base) {
  transition: $properties $duration;
}
```

**Usage:**
```scss
button {
    @include smooth-transition(background-color, $transition-fast);
    
    &:hover {
        background-color: $color-primary;
    }
}
```

---

## 📦 Component Styles

### DialogBox (_dialog-box.scss)

**Structure:**
```scss
.dialog-overlay           // Dark background behind modal
.dialog-box               // Main modal box
.dialog-header            // Title bar
.dialog-npc-name          // NPC name
.dialog-close-btn         // X button
.dialog-content           // Main content area
.dialog-sprite            // NPC image
.dialog-text              // Dialog text
.dialog-footer            // Button area
.dialog-action-btn        // "Continue" button
```

**Key Styles:**
- Overlay: Fixed positioning with backdrop blur
- Box: Gradient background, shadow
- Animation: slideInUp on open
- Responsive: 90% width on mobile

---

### QuestPopup (_quest-popup.scss)

**Structure:**
```scss
.quest-overlay            // Overlay
.quest-popup              // Main container
.quest-header             // Title area
.quest-tabs               // Lesson vs Quiz toggle
.quest-content            // Main area (lesson or quiz)
.quest-footer             // Button area
```

**Key Styles:**
- Large modal (600px wide)
- Tab switching for lesson/quiz
- Smooth transitions between modes

---

### Quiz (_quiz.scss)

**Structure:**
```scss
.quiz-container           // Main wrapper
.quiz-header              // Title & meta
.quiz-progress            // Progress bar
.quiz-content             // Question area
.quiz-footer              // Navigation buttons
```

**Key Styles:**
- Progress bar shows completion
- Scrollable content area
- Fixed footer for navigation

---

### MultipleChoiceQuestion (_multiple-choice.scss)

**Structure:**
```scss
.question-text            // Question heading
.options-container        // All options wrapper
.option-button            // Individual option
.option-text              // Option text
.option-check             // Checkmark/X icon
.feedback-box             // Success/error message
.feedback-message         // Feedback text
.feedback-explanation     // Explanation text
```

**Key States:**
- `:hover` - Option highlights
- `.selected` - User selected
- `.correct` - Answer was correct
- `.incorrect` - Answer was wrong
- `:disabled` - Can't select after answered

---

### FillInBlanksQuestion (_fill-in-blanks.scss)

**Structure:**
```scss
.question-text            // Question with blanks
.blank-input              // Input field
.blank-hint               // Hint text
.submit-btn               // Submit button
.feedback-box             // Success/error
```

---

### QuizResults (_quiz-results.scss)

**Structure:**
```scss
.results-container        // Main wrapper
.results-score            // Large score display (85%)
.results-message          // "Great job!" text
.results-breakdown        // Score details
.results-buttons          // Action buttons
```

**Key Features:**
- Large score display (impact)
- Pass/fail styling
- Clear call-to-action buttons

---

## 🌈 Color Usage Guide

### Use Cases

| Color | Use | Component |
|-------|-----|-----------|
| `$color-primary` | Main brand, highlights | Buttons, headers |
| `$color-success` | Correct answers, passed | Quiz results |
| `$color-error` | Wrong answers, failed | Quiz results |
| `$color-warning` | Caution, hints | Alert messages |
| `$color-bg-light` | Modal backgrounds | All modals |
| `$color-text-primary` | Main text | Body text |
| `$color-text-secondary` | Descriptions | Meta info |

---

## 📱 Responsive Design

### Breakpoints

```
Mobile:  ≤ 768px
Tablet:  769px - 1024px
Desktop: ≥ 1025px
```

### Mobile-First Approach

```scss
.container {
    // Mobile styles (default)
    padding: $spacing-sm;
    font-size: $font-size-sm;
    
    // Tablet & up
    @include tablet-only {
        padding: $spacing-md;
        font-size: $font-size-base;
    }
}
```

---

## ✨ Features

### Already Implemented ✅
- Complete variable system
- Reusable mixins
- Component-scoped styles
- Responsive design
- Accessibility features (focus rings)
- Smooth transitions
- Z-index system

### Best Practices ✅
- DRY (Don't Repeat Yourself)
- Modular organization
- Clear naming conventions
- Design tokens for consistency
- Easy theme customization

---

## 🔧 How to Customize

### Change Primary Color

```scss
// In _variables.scss
$color-primary: #6366f1;        // Change to indigo
$color-primary-dark: #4f46e5;
$color-primary-light: #e0e7ff;

// Automatically updates everywhere it's used
```

### Add New Component Style

1. Create file: `src/styles/_new-component.scss`
2. Import variables and mixins:
```scss
@import './variables';
@import './mixins';
```
3. Add styles using variables/mixins
4. Import in `src/styles/index.scss`:
```scss
@import './new-component';
```

### Update Spacing

```scss
// Change one variable
$spacing-lg: 28px;  // was 24px

// All components using it update automatically
```

---

## 🚀 Compilation

### From SCSS to CSS

```bash
# Using Vite (automatic)
npm run dev

# Or using SASS compiler
sass src/styles/index.scss src/styles/index.css
```

### Output

```css
/* src/styles/index.css (generated) */
/* All SCSS compiled to CSS */
/* Ready to be imported in React */
```

---

## 📊 File Size Impact

| File | Size | Purpose |
|------|------|---------|
| `_variables.scss` | ~500B | Design tokens |
| `_mixins.scss` | ~800B | Patterns |
| `_dialog-box.scss` | ~2KB | DialogBox styles |
| `_quiz.scss` | ~3KB | Quiz styles |
| **Total** | ~20KB | All component styles |

When minified: ~5KB (gzipped)

---

## 🎯 Best Practices

1. **Use variables:** Never hardcode colors/sizes
2. **Use mixins:** Don't repeat flex, transitions, etc.
3. **Component scoped:** Keep styles in their file
4. **Mobile first:** Write mobile styles, then enhance
5. **Consistent naming:** `.component-element` convention
6. **Group related:** Keep related properties together

---

## 🔗 Related Files

- **Main entry:** `src/styles/index.scss`
- **Compiled CSS:** `src/styles/index.css`
- **Global styles:** `styles/main.scss`
- **React imports:** Each component imports from `src/styles/`

---

## 📝 Naming Convention

```
.component-name                    // Root element
.component-name__element          // Child element
.component-name--modifier         // State/variant
.component-name__element--state   // Child state

Examples:
.dialog-box                       // Root
.dialog-box__header               // Child
.dialog-box__button--active       // State
.quiz__option--correct            // Child state
```

This follows the BEM (Block Element Modifier) convention for clarity and reusability.

