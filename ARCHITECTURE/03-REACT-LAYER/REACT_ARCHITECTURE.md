# ⚛️ React UI Layer Architecture

**Layer:** React 18 Components  
**Purpose:** Display game UI modals and handle user interactions  
**Status:** Components ready, integration in progress

---

## 📋 Overview

React layer is already implemented but needs integration with Phaser. The structure is:

```
GameUI (Parent - Container)
├── DialogBox (NPC conversation)
│   └── Shows dialog, emits: dialogClosed
│
└── QuestPopup (Quest container)
    ├── Lesson (Theory display)
    │   └── Shows lesson content, emits: startQuiz
    │
    └── Quiz (Quiz manager)
        ├── MultipleChoiceQuestion (MCQ display)
        ├── FillInBlanksQuestion (Fill-in display)
        └── QuizResults (Score display)
            └── Emits: questCompleted
```

---

## 🏗️ File Structure (Already Exists)

```
src/
├── components/
│   ├── DialogBox.jsx              ✅ Done
│   ├── QuestPopup.jsx             ✅ Done
│   ├── Lesson.jsx                 ✅ Done
│   ├── Quiz.jsx                   ✅ Done
│   ├── MultipleChoiceQuestion.jsx ✅ Done
│   ├── FillInBlanksQuestion.jsx   ✅ Done
│   ├── QuizResults.jsx            ✅ Done
│   └── README.md
│
├── hooks/
│   └── useGameEvents.js           ✅ Done (Event bus hook)
│
├── styles/
│   ├── index.scss                 ✅ Done
│   ├── _variables.scss            ✅ Done
│   ├── _mixins.scss               ✅ Done
│   ├── _dialog-box.scss           ✅ Done
│   ├── _quest-popup.scss          ✅ Done
│   ├── _quiz.scss                 ✅ Done
│   ├── _multiple-choice.scss      ✅ Done
│   ├── _fill-in-blanks.scss       ✅ Done
│   └── _quiz-results.scss         ✅ Done
│
├── GameUI.jsx                     ✅ Done (Main processor)
├── App.jsx                        ❌ TO DO (App wrapper)
└── index.jsx                      ❌ TO DO (React render)
```

---

## 1️⃣ GameUI.jsx - Main Event Processor

**Purpose:** Connect Phaser events to React components

**What it does:**
- Listens to Phaser events (`showDialog`, `showQuest`, etc.)
- Manages UI state (which modal is open)
- Passes data to child components
- Emits events back to Phaser

**Status:** ✅ READY (in COMPLETE_SYSTEM_SUBMISSION.md)

**Key State:**
```javascript
const [dialogOpen, setDialogOpen] = useState(false);
const [questOpen, setQuestOpen] = useState(false);
const [dialogData, setDialogData] = useState(null);
const [questData, setQuestData] = useState(null);
```

**Key Events:**
```javascript
// LISTEN FROM PHASER
useGameEventListener('showDialog', (data) => {
    setDialogData(data);
    setDialogOpen(true);
});

useGameEventListener('showQuest', (data) => {
    setQuestData(data);
    setQuestOpen(true);
});

// EMIT TO PHASER
const handleDialogClose = () => {
    emit('dialogClosed', { npcId: dialogData?.id });
};

const handleQuestComplete = (score, results) => {
    emit('questCompleted', { 
        questId: questData?.id,
        score: score,
        results: results
    });
};
```

---

## 2️⃣ DialogBox.jsx - NPC Dialog

**Purpose:** Show NPC conversation

**Props:**
```javascript
{
    npcData: {
        id: 1,
        name: "Mage",
        dialog: "Welcome, adventurer!",
        sprite: "npc_mage"
    },
    onClose: function,    // Called when user clicks "Continue"
    isOpen: boolean       // Show/hide modal
}
```

**Behavior:**
1. Receives NPC data from Phaser via GameUI
2. Displays NPC name and dialog
3. User clicks "Continue" button
4. Calls `onClose()` 
5. GameUI calls `emit('dialogClosed')`
6. Phaser receives and shows quest if available

**Features:**
- Smooth animation (slide up)
- Close button (X)
- Responsive design
- Styled with SCSS

---

## 3️⃣ QuestPopup.jsx - Quest Container

**Purpose:** Container for lesson + quiz flow

**Props:**
```javascript
{
    questData: {
        id: 1,
        title: "Variables Lesson",
        description: "Learn about variables...",
        lesson: { /* lesson content */ },
        quiz: { /* quiz data */ }
    },
    isOpen: boolean,      // Show/hide
    onClose: function,    // Called when user exits
    onComplete: function  // Called when quiz done
}
```

**State:**
```javascript
const [mode, setMode] = useState('lesson'); // 'lesson' | 'quiz' | 'results'
```

**Flow:**
1. Shows Lesson component first
2. User clicks "Start Quiz →"
3. Switches to Quiz component
4. Quiz shows questions
5. User answers all questions
6. Shows QuizResults
7. User clicks "Complete" or "Retry"

---

## 4️⃣ Lesson.jsx - Theory Display

**Purpose:** Display lesson content before quiz

**Props:**
```javascript
{
    lessonData: {
        title: "Introduction to Variables",
        content: "Variables are containers...",
        codeExample: "const x = 5;"
    },
    onStartQuiz: function,  // Called when user clicks "Start Quiz →"
    onClose: function
}
```

**Features:**
- Display lesson title
- Display lesson text
- Display code examples (if any)
- "Start Quiz →" button
- Close button

---

## 5️⃣ Quiz.jsx - Quiz Manager

**Purpose:** Orchestrate quiz flow

**Props:**
```javascript
{
    quizData: {
        id: 1,
        title: "Variables Quiz",
        questions: [
            { /* question 1 */ },
            { /* question 2 */ }
        ]
    },
    onComplete: function  // (score, results) => {}
}
```

**State:**
```javascript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState({});          // { questionId: answer }
const [showResults, setShowResults] = useState(false);
```

**Flow:**
1. Shows current question
2. User answers (clicks option or types)
3. User clicks "Next Question →"
4. Move to next question
5. Last question → Show results

---

## 6️⃣ MultipleChoiceQuestion.jsx - MCQ Display

**Purpose:** Render single multiple choice question

**Props:**
```javascript
{
    question: {
        id: 1,
        text: "What is a variable?",
        type: "multipleChoice",
        options: [
            { text: "A name for data", isCorrect: true },
            { text: "A type", isCorrect: false },
            { text: "A function", isCorrect: false }
        ]
    },
    onAnswer: function(optionId),  // Called when user selects
    disabled: boolean              // Can't select after answered
}
```

**Behavior:**
1. Display question text
2. Display all options as buttons
3. User clicks option
4. Show feedback (correct/incorrect)
5. Show explanation (if provided)
6. Disable buttons

---

## 7️⃣ FillInBlanksQuestion.jsx - Fill-in Display

**Purpose:** Render fill-in-the-blanks question

**Props:**
```javascript
{
    question: {
        id: 2,
        text: "A variable is a ____ for storing data",
        type: "fillInBlanks",
        blanks: [
            { position: 0, answer: "container" }
        ]
    },
    onAnswer: function(answers),
    disabled: boolean
}
```

**Behavior:**
1. Display question with input fields
2. User types answers
3. User clicks "Submit"
4. Show feedback
5. Disable inputs

---

## 8️⃣ QuizResults.jsx - Score Display

**Purpose:** Show quiz completion results

**Props:**
```javascript
{
    score: 85,           // Percentage
    totalQuestions: 2,
    correctAnswers: 1,
    answers: [
        { questionId: 1, userAnswer: "container", correct: true },
        { questionId: 2, userAnswer: "B", correct: false }
    ],
    onRetry: function,    // Retry quiz
    onBack: function,     // Back to lesson
    onClose: function     // Close quest
}
```

**Display:**
- Large score (85%)
- Message ("Great job! You passed!")
- Score breakdown
- Answer review (optional)
- Buttons: [Retry] [Back to Lesson] [Close]

---

## 🎯 EVENT FLOW (React Side)

### Step 1: NPC Interaction

```
Phaser (Player presses E near NPC)
    ↓
Phaser emits: 'showDialog'
    ↓
React GameUI listens: useGameEventListener('showDialog')
    ↓
GameUI updates state: setDialogOpen(true), setDialogData(data)
    ↓
DialogBox component renders with NPC data
    ↓
User sees dialog box on screen
```

### Step 2: Continue from Dialog

```
User clicks "Continue" button
    ↓
DialogBox calls: onClose()
    ↓
GameUI function: handleDialogClose()
    ↓
GameUI emits: 'dialogClosed'
    ↓
Phaser receives: window.gameEvents.on('dialogClosed')
    ↓
Phaser emits: 'showQuest'
    ↓
React GameUI listens and opens QuestPopup
```

### Step 3: Complete Quiz

```
User answers all questions and clicks "Complete"
    ↓
Quiz component calls: onComplete(score, results)
    ↓
GameUI function: handleQuestComplete(score, results)
    ↓
GameUI emits: 'questCompleted'
    ↓
Phaser receives: window.gameEvents.on('questCompleted')
    ↓
Phaser saves progress to database
    ↓
Phaser resumes game
    ↓
React closes QuestPopup
```

---

## 📊 Data Types

### DialogData
```javascript
{
    id: 1,
    name: "Mage",
    dialog: "Welcome, adventurer!",
    sprite: "npc_mage",
    quests: [1, 2]  // Array of quest IDs available
}
```

### QuestData
```javascript
{
    id: 1,
    title: "Variables Quest",
    description: "Learn variables from Mage",
    lesson: {
        title: "Introduction to Variables",
        content: "...",
        codeExample: "..."
    },
    quiz: {
        id: 1,
        title: "Variables Quiz",
        questions: [
            {
                id: 1,
                text: "What is a variable?",
                type: "multipleChoice",
                options: [...]
            }
        ]
    }
}
```

### QuizQuestion (Multiple Choice)
```javascript
{
    id: 1,
    text: "What is a variable?",
    type: "multipleChoice",
    options: [
        { id: 1, text: "A container for data", isCorrect: true },
        { id: 2, text: "A type", isCorrect: false }
    ],
    explanation: "Variables store data in memory"
}
```

### QuizQuestion (Fill-in)
```javascript
{
    id: 2,
    text: "A variable is a ____ for storing data",
    type: "fillInBlanks",
    blanks: [
        { position: 0, answer: "container", hint: "Something that holds things" }
    ],
    explanation: "Variables are containers"
}
```

---

## 🔌 Integration with Phaser

### In GameUI.jsx (Main processor)

```javascript
import { useGameEventListener, useGameEventEmitter } from '../hooks/useGameEvents';

function GameUI() {
    // ... state ...
    const { emit } = useGameEventEmitter();

    // LISTEN: Phaser sends showDialog
    useGameEventListener('showDialog', (dialogData) => {
        setDialogData(dialogData);
        setDialogOpen(true);
    });

    // LISTEN: Phaser sends showQuest
    useGameEventListener('showQuest', (questData) => {
        setQuestData(questData);
        setQuestOpen(true);
    });

    // EMIT: Tell Phaser dialog is closed
    const handleDialogClose = () => {
        setDialogOpen(false);
        emit('dialogClosed', { npcId: dialogData?.id });
    };

    // EMIT: Tell Phaser quest is completed
    const handleQuestComplete = (score, results) => {
        emit('questCompleted', { 
            questId: questData?.id,
            score: score,
            results: results
        });
    };

    return (
        <>
            <DialogBox 
                npcData={dialogData}
                onClose={handleDialogClose}
                isOpen={dialogOpen}
            />
            <QuestPopup
                questData={questData}
                isOpen={questOpen}
                onClose={() => setQuestOpen(false)}
                onComplete={handleQuestComplete}
            />
        </>
    );
}
```

---

## ✨ Key Features

### Already Implemented ✅
- Component hierarchy
- All component rendering logic
- Event hook system (useGameEventListener, useGameEventEmitter)
- SCSS styling
- Animations and transitions
- Responsive design
- Accessibility features

### Needs Integration ❌
- Connect to actual Phaser game
- Load real quest/lesson data
- Save results to backend
- User authentication
- Progress tracking

---

## 📝 File Locations

- **Components:** `src/components/*.jsx`
- **Hooks:** `src/hooks/useGameEvents.js`
- **Styles:** `src/styles/*.scss`
- **Game UI:** `src/GameUI.jsx`

---

## 🚀 Next Steps

1. **Create App.jsx** - Wrapper component
2. **Create index.jsx** - React render entry
3. **Setup Phaser integration** - Instantiate Phaser in App.jsx
4. **Create quest data files** - NPC, lesson, quiz content
5. **Test full flow** - Click E key → Dialog → Quiz → Results

