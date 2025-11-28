# React Component System for CoderQuest

## Overview
This directory contains React components for the CoderQuest educational game system. The components handle:
- NPC dialogs
- Quest/lesson display
- Quiz with multiple question types
- Score tracking and results

## Component Structure

```
src/
├── components/
│   ├── DialogBox.jsx           # NPC dialog display
│   ├── QuestPopup.jsx          # Main quest container
│   ├── Lesson.jsx              # Lesson content display
│   ├── Quiz.jsx                # Quiz manager
│   ├── MultipleChoiceQuestion.jsx  # Multiple choice questions
│   ├── FillInBlanksQuestion.jsx    # Fill-in-blank questions
│   └── QuizResults.jsx         # Results/score display
├── hooks/
│   └── useGameEvents.js        # Event communication with Phaser
└── styles/
    ├── _variables.scss         # Color, spacing, typography
    ├── _mixins.scss            # Reusable SCSS mixins
    ├── _dialog-box.scss        # Dialog styling
    ├── _quest-popup.scss       # Popup container styling
    ├── _lesson.scss            # Lesson content styling
    ├── _quiz.scss              # Quiz container styling
    ├── _multiple-choice.scss   # Multiple choice styling
    ├── _fill-in-blanks.scss    # Fill-in-blank styling
    └── _quiz-results.scss      # Results page styling
```

## Component Props & Usage

### DialogBox
Displays an NPC dialog with character name and message.

```jsx
import DialogBox from './components/DialogBox';

<DialogBox
  npcData={{
    name: "Mage",
    dialog: "Welcome to the adventure!",
    sprite: "npc1"
  }}
  onClose={() => console.log('Dialog closed')}
  isOpen={true}
/>
```

### QuestPopup
Main container that manages lesson and quiz switching.

```jsx
import QuestPopup from './components/QuestPopup';

<QuestPopup
  questData={{
    id: 'quest-1',
    lesson: {
      id: 'lesson-1',
      title: 'Introduction to Variables',
      content: 'Learn about variables...',
      quizId: 'quiz-1'
    },
    quiz: {
      id: 'quiz-1',
      title: 'Variables Quiz',
      questions: [...]
    }
  }}
  isOpen={true}
  onClose={() => console.log('Quest closed')}
/>
```

### Lesson
Displays educational content with optional quiz start button.

```jsx
import Lesson from './components/Lesson';

<Lesson
  lessonData={{
    title: 'Introduction to JavaScript',
    content: 'JavaScript is a programming language...',
    quizId: 'quiz-1'
  }}
  onStartQuiz={() => console.log('Quiz started')}
  onClose={() => console.log('Lesson closed')}
/>
```

### Quiz
Manages quiz flow and question progression.

```jsx
import Quiz from './components/Quiz';

<Quiz
  quizData={{
    id: 'quiz-1',
    title: 'JavaScript Basics',
    questions: [...]
  }}
  onComplete={(score, results) => console.log('Quiz complete')}
  onBack={() => console.log('Back to lesson')}
/>
```

## Question Types

### Multiple Choice
```javascript
{
  type: 'multipleChoice',
  id: 'q1',
  text: 'What is the capital of France?',
  explanation: 'Paris is the capital and largest city of France.',
  options: [
    { id: 'a', text: 'London', isCorrect: false },
    { id: 'b', text: 'Paris', isCorrect: true },
    { id: 'c', text: 'Berlin', isCorrect: false }
  ]
}
```

### Fill in the Blanks
```javascript
{
  type: 'fillInBlanks',
  id: 'q2',
  prompt: 'Complete the sentence:',
  sentence: 'The capital of France is [BLANK] and it is known for the [BLANK].',
  answers: ['Paris', 'Eiffel Tower'],
  explanation: 'Paris is the capital of France, famous for the Eiffel Tower.'
}
```

## Event Communication

Use the game event hooks to communicate between Phaser and React:

```jsx
import { useGameEventListener, useGameEventEmitter } from '../hooks/useGameEvents';

function MyComponent() {
  const { emit } = useGameEventEmitter();

  // Listen for events from Phaser
  useGameEventListener('showDialog', (npcData) => {
    console.log('Show dialog:', npcData);
  });

  // Emit events to Phaser
  const handleQuestComplete = () => {
    emit('questComplete', { questId: 'quest-1' });
  };

  return <button onClick={handleQuestComplete}>Complete Quest</button>;
}
```

## Available Events

### From Phaser to React
- `showDialog` - Show NPC dialog box
- `showQuest` - Show quest/lesson popup
- `showQuiz` - Start a quiz
- `closePopup` - Close any popup

### From React to Phaser
- `questComplete` - Quest was completed
- `quizComplete` - Quiz was completed with score
- `dialogClose` - Dialog was closed
- `questCancelled` - Quest was cancelled

## Sample Quest Data

```javascript
const sampleQuest = {
  id: 'quest-1',
  title: 'JavaScript Fundamentals',
  
  lesson: {
    id: 'lesson-1',
    title: 'Understanding Variables',
    content: {
      sections: [
        {
          title: 'What are Variables?',
          text: 'Variables are containers for storing data values. In JavaScript, you declare variables using let, const, or var keywords.'
        },
        {
          title: 'Example',
          code: `const name = 'John';
const age = 30;
console.log(name); // Output: John`
        },
        {
          title: 'Key Points',
          list: [
            'Use const for variables that should not be reassigned',
            'Use let for variables that may change',
            'Avoid using var in modern JavaScript'
          ]
        }
      ]
    },
    quizId: 'quiz-1'
  },

  quiz: {
    id: 'quiz-1',
    title: 'Variables Quiz',
    questions: [
      {
        type: 'multipleChoice',
        id: 'q1',
        text: 'Which keyword should be used for variables that should not be reassigned?',
        explanation: 'const is used for constants that should not be reassigned after declaration.',
        options: [
          { id: 'a', text: 'let', isCorrect: false },
          { id: 'b', text: 'const', isCorrect: true },
          { id: 'c', text: 'var', isCorrect: false }
        ]
      },
      {
        type: 'fillInBlanks',
        id: 'q2',
        prompt: 'Complete the code:',
        sentence: 'To declare a variable in JavaScript, we use [BLANK], let, or var keywords.',
        answers: ['const'],
        explanation: 'const, let, and var are the three keywords for declaring variables in JavaScript.'
      }
    ]
  }
};
```

## Styling

The component system uses SCSS with:
- **Colors**: Primary blue, secondary green, status colors (success, error, warning)
- **Spacing**: Consistent 4px-based grid (4, 8, 16, 24, 32, 48px)
- **Typography**: System fonts with clear hierarchy
- **Animations**: Smooth transitions and modal slide-in effects
- **Responsive**: Mobile-first design that works on all screen sizes

### Customizing Colors

Edit `src/styles/_variables.scss`:

```scss
$color-primary: #3b82f6;      // Blue
$color-secondary: #10b981;    // Green
$color-success: #10b981;      // Green
$color-error: #ef4444;        // Red
```

## Testing the Components

### Without Phaser
All components can be tested independently in a React app:

```jsx
import React, { useState } from 'react';
import QuestPopup from './components/QuestPopup';
import sampleQuestData from './data/sample-quest';

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <QuestPopup
      questData={sampleQuestData}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}

export default App;
```

### With Phaser
Emit events from Phaser to show React components:

```javascript
// In Phaser scene
this.game.events.emit('showQuest', sampleQuestData);
```

## Future Enhancements

- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Internationalization (i18n) support
- [ ] Branching dialog system
- [ ] Hint system for quiz questions
- [ ] Progress tracking and achievements
- [ ] Audio feedback for correct/incorrect answers
- [ ] Timer for timed quizzes
- [ ] Leaderboard integration
