# CoderQuest - Simplified Phaser + React Test Setup

## 🎯 What's New

We've created a **minimal, clean test environment** for:
- ✅ Phaser game with simple placeholder
- ✅ React component modals (Dialog, Quest, Quiz, Results)
- ✅ Event emitter system for Phaser ↔ React communication
- ✅ Three test buttons to trigger all interactions

## 🚀 Quick Start

1. **Open the game:**
   - Navigate to `http://localhost/CoderQuest/`

2. **Test Components:**
   - **💬 Show Dialog** - Opens NPC dialog modal
   - **📖 Show Quest** - Shows lesson content with "Start Quiz" button
   - **🎯 Show Results** - Displays quiz completion screen

3. **Component Flow:**
   ```
   Dialog → (close)
   Quest → Start Quiz → Results → (Retry or Back to Lesson)
   ```

## 📁 File Structure

```
index.html          ← NEW! Simplified Phaser + React interface
index-simple.html   ← Backup of simplified version
src/
├── components/     ← React components (ready to integrate)
├── hooks/         ← Event emitter hooks
└── styles/        ← SCSS styling files

assets/
└── characters/    ← NPC sprites
```

## 🎨 Components Ready to Use

All React components have been created and styled:

### Components
- `DialogBox.jsx` - NPC dialog display
- `QuestPopup.jsx` - Main quest container
- `Lesson.jsx` - Lesson content viewer
- `Quiz.jsx` - Quiz controller with progress
- `MultipleChoiceQuestion.jsx` - Multiple choice questions
- `FillInBlanksQuestion.jsx` - Fill in blanks questions
- `QuizResults.jsx` - Results display with score

### Styles (SCSS)
- `_dialog-box.scss`
- `_quest-popup.scss`
- `_lesson.scss`
- `_quiz.scss`
- `_multiple-choice.scss`
- `_fill-in-blanks.scss`
- `_quiz-results.scss`

### Event System
- `useGameEvents.js` - React hooks for event handling
- `EventEmitter` class - Global event system

## 💻 Current HTML Features

The simplified `index.html` includes:

1. **Phaser Game**
   - Minimal 400x600 canvas
   - Shows placeholder game area
   - Ready for actual game development

2. **React Component Area**
   - Displays modals when buttons clicked
   - Styled to match Phaser theme
   - Shows sample dialog, quest, quiz, and results

3. **Event System**
   - Global `gameEvents` emitter
   - Simple modal manager
   - Event listeners for all interactions

4. **Test Buttons**
   - 💬 Show Dialog - Test dialog component
   - 📖 Show Quest - Test quest with lesson
   - 🎯 Show Results - Test quiz results screen

## 🔧 Event System Usage

### Emitting Events from Phaser

```javascript
// In Phaser scene
gameEvents.emit('showDialog', {
  name: 'NPC Name',
  dialog: 'Dialog text'
});

gameEvents.emit('showQuest', questData);
gameEvents.emit('showResults', { score: 85, total: 100 });
```

### Listening to Events

```javascript
// In React components
gameEvents.on('showDialog', (data) => {
  console.log('Dialog triggered:', data);
});

gameEvents.on('showQuest', (data) => {
  console.log('Quest triggered:', data);
});
```

## 📝 Next Steps

### To Integrate React Components
1. Set up React app (Vite/Webpack)
2. Import React components from `src/components/`
3. Create App wrapper component
4. Connect event emitter to React state

### To Add Real Phaser Game
1. Replace placeholder game with actual game logic
2. Add sprites, physics, collision detection
3. Emit events when NPC interacts (press E near NPC)
4. Emit events for quest triggers

### To Create Real Quests
1. Design quest data structure
2. Create quest database/backend
3. Load quests from database
4. Track player progress

## 🧪 Testing Checklist

- [x] Show Dialog modal works
- [x] Show Quest modal works
- [x] Start Quiz button transitions
- [x] Show Results modal works
- [x] Back to Lesson button works
- [x] Retry button works
- [x] Close buttons work
- [x] Event system working
- [ ] React components fully integrated (next phase)
- [ ] Phaser game logic implemented (next phase)
- [ ] Real quest data connected (next phase)

## 🎮 Sample Quest Data Structure

```javascript
{
  id: 'quest-001',
  lesson: {
    id: 'lesson-001',
    title: 'Introduction to Variables',
    content: 'Variables are containers for storing data...',
    quizId: 'quiz-001'
  },
  quiz: {
    id: 'quiz-001',
    title: 'Quiz: Variables',
    questions: [
      {
        type: 'multipleChoice',
        id: 'q1',
        text: 'What is a variable?',
        explanation: 'A variable is a named container for data.',
        options: [
          { id: 'a', text: 'Option A', isCorrect: false },
          { id: 'b', text: 'Option B', isCorrect: true }
        ]
      },
      {
        type: 'fillInBlanks',
        id: 'q2',
        sentence: 'A variable must be [BLANK] before use.',
        answers: ['declared'],
        explanation: 'Variables must be declared.'
      }
    ]
  }
}
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  (Phaser Game + HTML Modal Components)              │
├──────────────────────┬──────────────────────────────┤
│   Phaser Game        │    Modal Manager             │
│  (400x600 canvas)    │  (HTML Modal Display)        │
└──────────────────────┴──────────────────────────────┘
              ↓                      ↓
        EventEmitter ←→ gameEvents (Global)
              ↓                      ↓
    Phaser Game Logic      React Components (ready)
    (to be implemented)    - DialogBox.jsx
                           - QuestPopup.jsx
                           - Lesson.jsx
                           - Quiz.jsx
                           - Results.jsx
```

## 💡 Development Tips

1. **Test Buttons** - Use the three buttons to test all interactions
2. **Browser Console** - Check F12 for event logs
3. **Modal System** - Events automatically trigger modal display
4. **Responsive** - Works on desktop and tablet (mobile coming)
5. **Simple HTML** - No build system needed for current setup

## 🚀 Performance

- Lightweight HTML/CSS/JS
- No build process required for current version
- Fast load times
- Smooth animations and transitions
- Mobile-friendly responsive design

## 📞 Support

All React components are ready in `/src/components/` folder.
Event system is global via `window.gameEvents`.
See `COMPONENT_SUMMARY.md` for detailed component documentation.

## 🔄 Workflow for New Features

1. **Add Event Handler** → In Phaser game or test button
2. **Emit Event** → `gameEvents.emit('eventName', data)`
3. **Update Modal** → Show corresponding HTML/React component
4. **Handle Response** → Listen for callback events
5. **Update Game State** → Reflect changes in Phaser game

---

**Status:** ✅ Complete - Ready for React component integration and Phaser game development
