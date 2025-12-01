# React Component Integration Guide

## Overview
This guide explains how to integrate the React components with the Phaser game and test them.

## File Structure

```
CoderQuest/
├── index.html                          # Phaser game (with event emitter)
├── component-test.html                 # Standalone component testing
├── src/
│   ├── GameUI.jsx                      # Main React wrapper
│   ├── components/
│   │   ├── DialogBox.jsx              # NPC dialog component
│   │   ├── QuestPopup.jsx             # Quest container
│   │   ├── Lesson.jsx                 # Lesson display
│   │   ├── Quiz.jsx                   # Quiz manager
│   │   ├── MultipleChoiceQuestion.jsx # MC questions
│   │   ├── FillInBlanksQuestion.jsx   # Fill-in-blank questions
│   │   └── QuizResults.jsx            # Results display
│   ├── hooks/
│   │   └── useGameEvents.js           # Event communication
│   ├── data/
│   │   └── sampleQuests.js            # Sample quest data
│   └── styles/
│       ├── _variables.scss            # Colors, spacing
│       ├── _mixins.scss               # SCSS utilities
│       ├── _dialog-box.scss
│       ├── _quest-popup.scss
│       ├── _lesson.scss
│       ├── _quiz.scss
│       ├── _multiple-choice.scss
│       ├── _fill-in-blanks.scss
│       ├── _quiz-results.scss
│       └── index.scss                 # Main stylesheet
```

## How It Works

### 1. Event Emitter System

The event emitter is initialized in `index.html` and provides a bridge between Phaser and React:

```javascript
// In index.html - automatically initialized
window.gameEvents.emit('showDialog', npcData);
window.gameEvents.emit('showQuest', questData);
```

### 2. Phaser to React Communication

**From Phaser:**
```javascript
// Show NPC dialog
showTestDialog() {
  window.gameEvents.emit('showDialog', {
    name: 'Test NPC',
    dialog: 'This is a test dialog!',
    sprite: 'npc1'
  });
}

// Show quest/lesson
showTestQuest() {
  window.gameEvents.emit('showQuest', questData);
}
```

**Received by React (in GameUI.jsx):**
```jsx
useGameEventListener('showDialog', (data) => {
  setDialogData(data);
  setDialogOpen(true);
});
```

### 3. React to Phaser Communication

**From React:**
```jsx
const { emit } = useGameEventEmitter();

emit('questCompleted', { 
  questId: 'quest-1',
  score: 80,
  results: [...]
});
```

**Received by Phaser:**
```javascript
window.gameEvents.on('questCompleted', (data) => {
  console.log('Quest complete:', data);
  // Award player points, unlock next quest, etc.
});
```

## Testing Components

### Test Keyboard Shortcuts

In the Phaser game (`index.html`):
- **D key** - Show test dialog
- **Q key** - Show test quest/lesson
- **E key** - Interact with NPCs (show their dialog)
- **ESC key** - Close dialogs

### Running the Game

1. Start your local server:
   ```bash
   cd c:\xampp\htdocs\CoderQuest
   npx http-server
   # or use your XAMPP Apache
   ```

2. Open in browser: `http://localhost/CoderQuest/`

3. Test the components:
   - Press **D** to see dialog test
   - Press **Q** to see quest/lesson test
   - Move with **WASD** and press **E** near NPCs

## Available Events

### Phaser Emits
- `showDialog(npcData)` - Display NPC dialog
- `showQuest(questData)` - Display quest/lesson
- `closePopup()` - Close any open popup

### React Emits
- `dialogClosed(npcId)` - Dialog was closed
- `questClosed(questId)` - Quest popup closed
- `questCompleted(score, results)` - Quiz completed

## Sample Event Flow

1. **Player presses Q key in Phaser**
   ```javascript
   this.input.keyboard.on('keydown-Q', () => this.showTestQuest());
   ```

2. **Phaser emits quest data**
   ```javascript
   window.gameEvents.emit('showQuest', testQuestData);
   ```

3. **React component listens and updates**
   ```jsx
   useGameEventListener('showQuest', (data) => {
     setQuestData(data);
     setQuestOpen(true);
   });
   ```

4. **Component renders**
   - QuestPopup shows
   - Lesson content displays
   - User can start quiz

5. **User completes quiz**
   ```jsx
   emit('questCompleted', { questId: 'test-quest', score: 80 });
   ```

6. **Phaser receives event**
   ```javascript
   window.gameEvents.on('questCompleted', (data) => {
     console.log('Quest completed with score:', data.score);
   });
   ```

## Component Props Reference

### DialogBox
```jsx
<DialogBox
  npcData={{
    name: string,
    dialog: string,
    sprite: string (without .png extension)
  }}
  onClose={() => {}}
  isOpen={boolean}
/>
```

### QuestPopup
```jsx
<QuestPopup
  questData={{
    id: string,
    lesson: {...},
    quiz: {...}
  }}
  isOpen={boolean}
  onClose={() => {}}
/>
```

### Lesson
```jsx
<Lesson
  lessonData={{
    title: string,
    content: string | object with sections,
    quizId: string
  }}
  onStartQuiz={() => {}}
  onClose={() => {}}
/>
```

### Quiz
```jsx
<Quiz
  quizData={{
    id: string,
    title: string,
    questions: [
      {
        type: 'multipleChoice' | 'fillInBlanks',
        id: string,
        text: string,
        options: [...],
        explanation: string
      }
    ]
  }}
  onComplete={(score, results) => {}}
  onBack={() => {}}
/>
```

## Question Types

### Multiple Choice
```javascript
{
  type: 'multipleChoice',
  id: 'q1',
  text: 'Question text?',
  explanation: 'Why this answer...',
  options: [
    { id: 'a', text: 'Option 1', isCorrect: false },
    { id: 'b', text: 'Option 2', isCorrect: true },
    { id: 'c', text: 'Option 3', isCorrect: false }
  ]
}
```

### Fill in the Blanks
```javascript
{
  type: 'fillInBlanks',
  id: 'q2',
  prompt: 'Complete the sentence:',
  sentence: 'The capital of France is [BLANK] and...',
  answers: ['Paris'],
  explanation: 'Paris is the capital of France.'
}
```

## Styling Customization

Edit `src/styles/_variables.scss`:

```scss
// Colors
$color-primary: #3b82f6;
$color-secondary: #10b981;
$color-success: #10b981;
$color-error: #ef4444;

// Spacing (4px based grid)
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// Font sizes
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
```

## Troubleshooting

### Components don't appear
- Check browser console for JavaScript errors
- Verify `window.gameEvents` exists in console
- Check that React app is running and listening

### Events not being received
- Make sure event emitter is initialized before game
- Check event names are spelled correctly
- Use browser DevTools to log all events

### Styling issues
- SCSS files must be imported in correct order
- Check that SCSS variables are defined before use
- Clear browser cache if styles don't update

## Next Steps

1. **Create actual quest data** - Replace sample data with real lesson content
2. **Add sound effects** - Emit events for audio feedback
3. **Add animations** - Enhance transitions between components
4. **Implement persistence** - Save quiz scores and progress
5. **Add more question types** - Drag-and-drop, code completion, etc.
