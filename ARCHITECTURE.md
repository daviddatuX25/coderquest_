# CoderQuest Component Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Phaser Game (3D/2D)                      │
│  - Player Movement                                          │
│  - Map Rendering                                            │
│  - NPC Interactions                                         │
│  - Physics & Collisions                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ window.gameEvents
                  │ (Bidirectional Event Emitter)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              React Component System (GameUI)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              GameUI (Main Wrapper)                     │ │
│  │  - Listen to game events                              │ │
│  │  - Manage dialog/quest state                          │ │
│  │  - Emit completion events                             │ │
│  └────────────┬───────────────┬──────────────────────────┘ │
│               │               │                             │
│        ┌──────▼────────┐ ┌────▼──────────┐                 │
│        │  DialogBox    │ │ QuestPopup    │                 │
│        │  (NPC Dialog) │ │ (Container)   │                 │
│        └───────────────┘ └────┬──────────┘                 │
│                               │                             │
│                        ┌──────▼─────────────┐               │
│                        │  Lesson Content    │               │
│                        │  - Title           │               │
│                        │  - Sections        │               │
│                        │  - Code blocks     │               │
│                        │  - Lists           │               │
│                        │  - Start Quiz BTN  │               │
│                        └──────┬─────────────┘               │
│                               │                             │
│                        ┌──────▼─────────────┐               │
│                        │  Quiz System       │               │
│                        │  - Progress Bar    │               │
│                        │  - Questions       │               │
│                        │  - Feedback        │               │
│                        │  - Results Page    │               │
│                        └────────────────────┘               │
│                                                              │
│  Question Types:                                            │
│  ┌──────────────────────┬─────────────────────┐            │
│  │ Multiple Choice      │ Fill in the Blanks  │            │
│  │ - Option buttons     │ - Text inputs       │            │
│  │ - Selection state    │ - Input validation  │            │
│  │ - Feedback           │ - Sentence parsing  │            │
│  └──────────────────────┴─────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
GameUI (Main Container)
├── DialogBox
│   └── (NPC sprite, name, dialog text)
│
└── QuestPopup (Modal Container)
    ├── Header
    │   └── Close Button
    │
    └── Content (Switches between lesson/quiz)
        ├── Lesson
        │   ├── Title
        │   ├── Content Sections
        │   │   ├── Text
        │   │   ├── Code Blocks
        │   │   └── Lists
        │   └── Action Buttons
        │       ├── Close
        │       └── Start Quiz
        │
        └── Quiz
            ├── Header
            │   ├── Quiz Title
            │   └── Question Counter
            ├── Progress Bar
            ├── Question Content
            │   ├── MultipleChoiceQuestion
            │   │   └── Option Buttons (with feedback)
            │   │
            │   └── FillInBlanksQuestion
            │       └── Input Fields
            ├── Feedback Display
            └── Results
                ├── Score Display
                ├── Statistics
                ├── Performance Feedback
                └── Action Buttons
                    ├── Retry Quiz
                    └── Back to Lesson
```

## Data Flow

### Event Flow: Phaser → React

```
Keyboard Input (D, Q, E)
    ↓
Phaser Event Handler
    ↓
window.gameEvents.emit('showDialog'|'showQuest')
    ↓
React useGameEventListener Hook
    ↓
GameUI State Updated (setDialogOpen / setQuestOpen)
    ↓
Component Re-renders
    ↓
User Sees Dialog/Quest Modal
```

### Event Flow: React → Phaser

```
User Interaction (clicks, submits quiz)
    ↓
React Component Handler
    ↓
emit('questCompleted', score)
    ↓
window.gameEvents.on('questCompleted')
    ↓
Phaser Game Handler
    ↓
Award Points / Unlock Next Quest / etc
```

## State Management

```
GameUI (Root State)
│
├── dialogOpen (boolean)
├── dialogData (npcData object)
│
├── questOpen (boolean)
├── questData (questData object)
│
└── Passes state to children:
    ├── DialogBox (uses isOpen, npcData)
    └── QuestPopup (uses isOpen, questData)

QuestPopup (Local State)
│
└── mode ('lesson' | 'quiz')
    └── Determines which child renders

Quiz (Local State)
│
├── currentQuestionIndex
├── score
├── answers (array)
└── showResults (boolean)

Question Components (Local State)
│
├── selected (for MC)
├── answers (for FillInBlanks)
├── answered (submission state)
└── feedback (correct/incorrect/explanation)
```

## Styling Architecture

```
SCSS Variables
│
└── _variables.scss
    ├── Colors (primary, secondary, success, error)
    ├── Spacing (xs, sm, md, lg, xl, 2xl)
    ├── Typography (fonts, sizes, weights)
    ├── Border radius
    ├── Shadows
    ├── Transitions
    └── Z-index layers

SCSS Mixins
│
└── _mixins.scss
    ├── Flexbox (flex-center, flex-between)
    ├── Button/Input reset
    ├── Overlay styles
    ├── Animations (slideIn, fadeIn)
    ├── Responsive (tablet-up, desktop-up)
    └── Utilities (truncate, scrollbar)

Component Styles
│
├── _dialog-box.scss
├── _quest-popup.scss
├── _lesson.scss
├── _quiz.scss
├── _multiple-choice.scss
├── _fill-in-blanks.scss
├── _quiz-results.scss
│
└── index.scss (imports all)
```

## Animation Flow

```
DialogBox Appearance
└── Overlay + Component Animation
    ├── Backdrop fades in (300ms)
    ├── Modal slides up (300ms)
    └── Content fades in

Question Transition
└── Fade out current + Fade in new
    ├── Duration: 200ms
    └── Easing: ease-in-out

Feedback Animation
└── Slide in + Fade
    ├── Duration: 300ms
    ├── Slide from top: -10px
    └── Opacity: 0 → 1

Button Hover
└── Transform + Shadow
    ├── translateY(-2px)
    ├── Shadow increase
    └── Duration: 200ms
```

## Quiz Scoring Algorithm

```
Quiz Completion
│
├── Iterate through all questions
│   └── For each question:
│       ├── IF user answer == correct answer
│       │   └── score += 1
│       └── Store in results array
│
├── Calculate statistics
│   ├── Total correct
│   ├── Total wrong
│   └── Percentage (correct / total * 100)
│
├── Generate feedback
│   ├── 100% → "Perfect Score!"
│   ├── 80%+ → "Great job!"
│   ├── 70%+ → "Good effort!"
│   ├── 50%+ → "Keep practicing!"
│   └── <50% → "Don't give up!"
│
└── Display Results
    ├── Score circle with percentage
    ├── Correct/total count
    ├── Feedback message
    ├── Pass/fail status (70% = pass)
    └── Action buttons (Retry, Back)
```

## Responsive Breakpoints

```
Mobile (< 480px)
├── Full-width components
├── Reduced padding
├── Single column layouts
└── Larger touch targets

Tablet (768px - 1023px)
├── Max-width containers
├── Flexible grid layouts
├── Optimized spacing
└── Medium padding

Desktop (1024px+)
├── Centered containers
├── Multi-column layouts
├── Hover effects
└── Comfortable spacing
```

## Browser Compatibility

```
Modern Browsers (Latest 2 versions)
├── Chrome/Edge (Chromium)
├── Firefox
├── Safari
└── Mobile browsers (iOS Safari, Chrome Mobile)

Features Used
├── CSS Grid & Flexbox
├── CSS Custom Properties (variables)
├── CSS Animations & Transitions
├── JavaScript ES6+
├── React Hooks
└── SCSS/SASS
```

---

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Maintainable code
- ✅ Scalable system
- ✅ Easy to test
- ✅ Performance optimized
