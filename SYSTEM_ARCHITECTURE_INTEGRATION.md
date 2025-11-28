# CoderQuest - System Architecture & Integration Guide

**Version:** 1.0  
**Date:** November 28, 2025  
**Status:** Complete Submission Ready

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CODERQUEST GAME SYSTEM                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      LAYER 1: PHASER GAME ENGINE                           │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ GameScene (Main Game Loop)                                             │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │  • Player sprite & movement                                            │ │
│ │  • Map rendering (jungle, town, city)                                 │ │
│ │  • NPC positioning & interaction zones                                 │ │
│ │  • Camera tracking                                                     │ │
│ │  • Collision detection                                                 │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                   ↓ EMITS EVENTS                           │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ NPCSystem (Game Entities)                                              │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │  • NPC sprites & animation                                             │ │
│ │  • Proximity detection (80px radius)                                   │ │
│ │  • Dialog trigger logic                                                │ │
│ │  • Quest assignment                                                    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                   ↓ EMITS EVENTS                           │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ MapTransition (Navigation)                                             │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │  • Map boundaries                                                      │ │
│ │  • Scene switching                                                     │ │
│ │  • Fade transitions                                                    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                        ↓ PHASER EVENT EMISSION
         ┌──────────────────────────────────────┐
         │  window.gameEvents (Event Bus)      │
         │  ├─ showDialog                      │
         │  ├─ showQuest                       │
         │  ├─ dialogClosed                    │
         │  ├─ questClosed                     │
         │  ├─ questCompleted                  │
         │  └─ mapChanged                      │
         └──────────────────────────────────────┘
                        ↓ REACT LISTENING
┌─────────────────────────────────────────────────────────────────────────────┐
│                     LAYER 2: REACT COMPONENT TREE                           │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ GameUI (Event Processor)                    [PARENT COMPONENT]        │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │ State:                                                                 │ │
│ │  • dialogOpen (boolean)                                               │ │
│ │  • questOpen (boolean)                                                │ │
│ │  • dialogData (object)                                                │ │
│ │  • questData (object)                                                 │ │
│ │                                                                        │ │
│ │ Listeners:                                                             │ │
│ │  • 'showDialog' → setDialogOpen(true)                                │ │
│ │  • 'showQuest' → setQuestOpen(true)                                  │ │
│ │  • 'closePopup' → set both false                                     │ │
│ │                                                                        │ │
│ │ Emitters:                                                              │ │
│ │  • emit('dialogClosed') → handleDialogClose()                        │ │
│ │  • emit('questClosed') → handleQuestClose()                          │ │
│ │  • emit('questCompleted') → handleQuestComplete()                    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ├─ DialogBox (Child 1)                        [CHILD COMPONENT]          │
│  │  └─ Props: npcData, onClose, isOpen                                   │
│  │  └─ Renders: NPC dialog overlay                                       │
│  │  └─ Emits: None                                                        │
│  │                                                                        │
│  └─ QuestPopup (Child 2)                       [CHILD COMPONENT]          │
│     └─ Props: questData, isOpen, onClose                                │
│     │                                                                    │
│     ├─ Lesson (Grandchild 2a)                  [GRANDCHILD]             │
│     │  └─ Props: lessonData, onStartQuiz                                │
│     │  └─ Renders: Lesson content                                       │
│     │  └─ Start button → setMode('quiz')                                │
│     │                                                                    │
│     └─ Quiz (Grandchild 2b)                    [GRANDCHILD]             │
│        └─ Props: quizData, onComplete, onBack                           │
│        │                                                                │
│        ├─ MultipleChoiceQuestion (Great-grandchild)                    │
│        │  └─ Props: question, onAnswer, disabled                       │
│        │  └─ State: selected, answered, feedback                       │
│        │  └─ Renders: Radio-style options                              │
│        │                                                                │
│        ├─ FillInBlanksQuestion (Great-grandchild)                      │
│        │  └─ Props: question, onAnswer, disabled                       │
│        │  └─ State: answers, answered, feedback                        │
│        │  └─ Renders: Text inputs for blanks                           │
│        │                                                                │
│        └─ QuizResults (Great-grandchild)                               │
│           └─ Props: score, totalQuestions, answers                     │
│           └─ Emits: onRetry, onBack                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                        ↓ COMPONENT STATE UPDATES
         ┌──────────────────────────────────────┐
         │  SCSS Styling Applied               │
         │  ├─ Dialog animations               │
         │  ├─ Quiz transitions                │
         │  ├─ Button states                   │
         │  └─ Responsive layout               │
         └──────────────────────────────────────┘
                        ↓ REACT EMITS EVENTS
         ┌──────────────────────────────────────┐
         │  window.gameEvents (Event Bus)      │
         │  ← emit() calls from React          │
         │  ├─ dialogClosed                    │
         │  ├─ questClosed                     │
         │  └─ questCompleted                  │
         └──────────────────────────────────────┘
                        ↓ BACK TO PHASER
┌─────────────────────────────────────────────────────────────────────────────┐
│                  LAYER 3: DATABASE & BACKEND API                           │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ REST API Endpoints (Node.js/Express)                                   │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │  POST   /api/auth/register         → Create user account              │ │
│ │  POST   /api/auth/login            → Authenticate user                │ │
│ │  GET    /api/lessons               → Fetch all lessons                │ │
│ │  GET    /api/quests/:lessonId      → Fetch quests for lesson         │ │
│ │  GET    /api/quizzes/:questId      → Fetch quiz questions            │ │
│ │  POST   /api/quiz-results          → Submit quiz answers             │ │
│ │  GET    /api/progress/:userId      → Fetch user progress             │ │
│ │  PUT    /api/progress/:userId      → Update progress                 │ │
│ │  GET    /api/achievements/:userId  → Fetch achievements              │ │
│ │  GET    /api/npcs                  → Fetch NPC data                  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                   ↓                                        │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ MySQL Database (Normalized 3NF)                                        │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │ Tables (12 total):                                                     │ │
│ │  • users                    [User accounts]                            │ │
│ │  • lessons                  [Learning content]                         │ │
│ │  • quests                   [Quest definitions]                        │ │
│ │  • quizzes                  [Assessment containers]                    │ │
│ │  • quiz_questions           [Question bank]                            │ │
│ │  • question_options         [MC answers]                               │ │
│ │  • question_answers         [Fill-in answers]                          │ │
│ │  • user_progress            [Progress tracking]                        │ │
│ │  • quiz_results             [Assessment results]                       │ │
│ │  • user_answers             [Detailed responses]                       │ │
│ │  • npc_characters           [Game entities]                            │ │
│ │  • user_achievements        [Gamification]                             │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Event Flow Sequence Diagram

### Complete User Journey: NPC Meeting → Quiz Completion

```
STEP 1: PLAYER MOVEMENT
┌──────────────────────────────────────────────────────────────┐
│ Player walks toward NPC                                      │
│ Phaser checks proximity in game loop                          │
│                                                               │
│ Distance < 80px?                                             │
│   ├─ YES: Call checkNPCProximity()                          │
│   └─ Set NPC.isHighlighted = true                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 2: PHASER EMITS EVENT #1
┌──────────────────────────────────────────────────────────────┐
│ gameEvents.emit('showDialog', {                             │
│   id: 'npc1',                                               │
│   name: 'Mage Mentor',                                       │
│   dialog: 'Learn about variables!',                          │
│   sprite: 'npc1',                                            │
│   questData: [{ ... }]                                       │
│ })                                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 3: REACT LISTENS (GameUI)
┌──────────────────────────────────────────────────────────────┐
│ useGameEventListener('showDialog', (data) => {             │
│   setDialogData(data)                                       │
│   setDialogOpen(true)                                       │
│ })                                                           │
│                                                               │
│ → Trigger re-render → DialogBox component shows             │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 4: USER INTERACTION
┌──────────────────────────────────────────────────────────────┐
│ User sees dialog overlay                                     │
│ User reads dialog text                                       │
│ User clicks "Continue" button                                │
│                                                               │
│ DialogBox.handleClose() called                               │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 5: REACT EMITS EVENT #1
┌──────────────────────────────────────────────────────────────┐
│ GameUI.handleDialogClose() calls:                           │
│                                                               │
│ emit('dialogClosed', {                                      │
│   npcId: 'npc1',                                            │
│   timestamp: Date.now()                                      │
│ })                                                           │
│                                                               │
│ setDialogOpen(false) → Dialog hidden                         │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 6: PHASER LISTENS
┌──────────────────────────────────────────────────────────────┐
│ scene.eventEmitter.on('dialogClosed', (data) => {          │
│   // Dialog closed, check if NPC has quest                 │
│   if (activeNPC.questData && length > 0) {                 │
│     show quest popup in React                              │
│   }                                                           │
│ })                                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 7: PHASER EMITS EVENT #2
┌──────────────────────────────────────────────────────────────┐
│ gameEvents.emit('showQuest', {                              │
│   id: 'quest-variables',                                    │
│   title: 'Understanding Variables',                          │
│   description: '...',                                        │
│   lesson: {                                                  │
│     id: 'lesson-variables',                                 │
│     title: 'What are Variables?',                            │
│     content: { sections: [...] }                            │
│   },                                                         │
│   quiz: {                                                    │
│     id: 'quiz-variables',                                   │
│     title: 'Variables Quiz',                                │
│     questions: [...]                                        │
│   }                                                          │
│ })                                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 8: REACT LISTENS & SHOWS QUEST
┌──────────────────────────────────────────────────────────────┐
│ useGameEventListener('showQuest', (data) => {              │
│   setQuestData(data)                                        │
│   setQuestOpen(true)                                        │
│ })                                                           │
│                                                               │
│ → QuestPopup renders with Lesson component                  │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 9: USER READS LESSON
┌──────────────────────────────────────────────────────────────┐
│ Lesson component displays:                                   │
│  ├─ Title: "What are Variables?"                            │
│  ├─ Sections with content                                   │
│  ├─ Code examples                                            │
│  └─ "Start Quiz →" button                                   │
│                                                               │
│ User clicks "Start Quiz →"                                  │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 10: QUIZ BEGINS
┌──────────────────────────────────────────────────────────────┐
│ QuestPopup.setMode('quiz')                                  │
│ Quiz component renders first question                        │
│                                                               │
│ Question Type = 'multipleChoice'                            │
│  ├─ Question text displayed                                 │
│  ├─ Options shown as buttons                                │
│  └─ User selects one option                                 │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 11: ANSWER SUBMITTED
┌──────────────────────────────────────────────────────────────┐
│ MultipleChoiceQuestion.handleSelectOption()                 │
│  ├─ Check if correct                                        │
│  ├─ Show feedback                                            │
│  ├─ Update score if correct                                 │
│  └─ Call onAnswer(questionId, answer, isCorrect)            │
│                                                               │
│ Quiz component receives answer                               │
│  ├─ Store in answers array                                  │
│  ├─ Move to next question                                   │
│  └─ Repeat for all questions                                │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 12: QUIZ COMPLETE - SHOW RESULTS
┌──────────────────────────────────────────────────────────────┐
│ All questions answered                                       │
│ → QuizResults component shown                               │
│                                                               │
│ Results display:                                             │
│  ├─ Score circle: "85%"                                     │
│  ├─ Feedback: "Great job! You did very well!"             │
│  ├─ Score breakdown: "Correct: 6/7"                        │
│  ├─ Pass/Fail status                                        │
│  ├─ "Retry Quiz" button                                     │
│  └─ "Back to Lesson" button                                 │
│                                                               │
│ User happy → clicks nowhere (closes after delay)            │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 13: REACT EMITS EVENT #2
┌──────────────────────────────────────────────────────────────┐
│ User clicks outside or Quest popup closes                   │
│                                                               │
│ GameUI.handleQuestComplete() calls:                         │
│                                                               │
│ emit('questCompleted', {                                    │
│   questId: 'quest-variables',                               │
│   score: 85,                                                │
│   results: [                                                 │
│     { questionId, answer, isCorrect },                      │
│     ...                                                      │
│   ],                                                         │
│   timestamp: Date.now()                                      │
│ })                                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 14: PHASER RECEIVES RESULTS
┌──────────────────────────────────────────────────────────────┐
│ scene.eventEmitter.on('questCompleted', (data) => {        │
│   // Save results                                            │
│   completedQuests[questId] = {                              │
│     score: 85,                                              │
│     timestamp: Date.now(),                                  │
│     results: data.results                                   │
│   };                                                         │
│                                                               │
│   // Send to backend                                         │
│   saveProgressToDatabase(questId, 85);                      │
│                                                               │
│   // Award achievement                                       │
│   if (score >= 70) {                                        │
│     emit('achievementEarned', {...});                      │
│   }                                                          │
│                                                               │
│   // Resume game                                             │
│   this.resume();                                             │
│   this.physics.resume();                                     │
│ })                                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 15: DATABASE TRANSACTION
┌──────────────────────────────────────────────────────────────┐
│ Backend API (POST /api/quiz-results) receives:              │
│  ├─ userId: 1                                               │
│  ├─ quizId: 1                                               │
│  ├─ score: 6                                                │
│  ├─ totalQuestions: 7                                       │
│  └─ userAnswers: [...]                                      │
│                                                               │
│ Database transactions:                                       │
│                                                               │
│ INSERT INTO quiz_results VALUES(                            │
│   NULL, 1, 1, 6, 7, 85, 1, NOW(), NOW()                    │
│ );                                                           │
│ result_id = 42                                              │
│                                                               │
│ INSERT INTO user_answers VALUES(                            │
│   NULL, 42, 1, 'const', 1, NOW()                           │
│ );                                                           │
│ ... (repeat for all answers)                                │
│                                                               │
│ UPDATE user_progress                                         │
│   SET status = 'completed',                                 │
│       completion_percentage = 100,                          │
│       completed_at = NOW()                                  │
│   WHERE user_id = 1 AND quest_id = 1;                      │
│                                                               │
│ INSERT INTO user_achievements VALUES(                       │
│   NULL, 1, 'quiz_passed', '...', 'icon.png', NOW()        │
│ );                                                           │
│                                                               │
│ RESPONSE: { success: true, achievement: 'quiz_passed' }    │
└──────────────────────────────────────────────────────────────┘
                          ↓
STEP 16: GAME RESUMES
┌──────────────────────────────────────────────────────────────┐
│ Player is back in game world                                 │
│ NPC may have new dialog                                      │
│ Can move on to next quest                                    │
│ Achievement badge displayed                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Communication Patterns

### Pattern 1: Parent ↔ Child (Props & Callbacks)

```javascript
// Parent Component: GameUI
function GameUI() {
  const [questData, setQuestData] = useState(null);
  
  const handleQuestComplete = (score, results) => {
    // Parent receives callback from child
    // Can update state or emit events
  };
  
  return (
    <QuestPopup
      questData={questData}              // Props DOWN
      onComplete={handleQuestComplete}   // Callback UP
    />
  );
}

// Child Component: QuestPopup
function QuestPopup({ questData, onComplete }) {
  // Child uses props
  // Calls onComplete(score, results) to notify parent
}
```

### Pattern 2: Sibling Communication (Event Bus)

```javascript
// Component A: DialogBox
const handleClose = () => {
  emit('dialogClosed', { npcId });  // Emit to bus
};

// Component B: GameUI (listening)
useGameEventListener('dialogClosed', (data) => {
  // Handle event from sibling
  showNextComponent();
});
```

### Pattern 3: External Integration (Game ↔ React)

```javascript
// From Phaser (Game Engine)
window.gameEvents.emit('showDialog', dialogData);

// Heard by React (Component)
useGameEventListener('showDialog', (data) => {
  setDialogData(data);
  setDialogOpen(true);
});

// React responds
emit('dialogClosed', { npcId });

// Phaser listens
scene.eventEmitter.on('dialogClosed', (data) => {
  // Resume game
});
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│ GAME STATE (Phaser)                                         │
│                                                              │
│ gameState = {                                               │
│   currentMap: 'jungle',                                     │
│   playerPosition: { x: 100, y: 100 },                       │
│   npcsInRange: [npc1, npc2],                                │
│   activeDialog: { npcId, data },                            │
│   questsActive: [quest1, quest2],                           │
│   completedQuests: {                                        │
│     'quest-1': { score: 85, timestamp }                     │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
              ↓ SYNCS VIA EVENTS
┌─────────────────────────────────────────────────────────────┐
│ UI STATE (React)                                            │
│                                                              │
│ GameUI:                                                     │
│  - dialogOpen: boolean                                      │
│  - questOpen: boolean                                       │
│  - dialogData: object                                       │
│  - questData: object                                        │
│                                                              │
│ QuestPopup:                                                 │
│  - mode: 'lesson' | 'quiz'                                  │
│                                                              │
│ Quiz:                                                       │
│  - currentQuestionIndex: number                             │
│  - score: number                                            │
│  - answers: array                                           │
│  - showResults: boolean                                     │
│                                                              │
│ MultipleChoiceQuestion:                                     │
│  - selected: string                                         │
│  - answered: boolean                                        │
│  - feedback: object                                         │
└─────────────────────────────────────────────────────────────┘
              ↓ PERSISTS TO
┌─────────────────────────────────────────────────────────────┐
│ DATABASE STATE (MySQL)                                      │
│                                                              │
│ user_progress:                                              │
│  - status: 'completed'                                      │
│  - completion_percentage: 100                               │
│  - completed_at: timestamp                                  │
│                                                              │
│ quiz_results:                                               │
│  - score: 6                                                 │
│  - total_questions: 7                                       │
│  - percentage: 85                                           │
│  - passed: true                                             │
│                                                              │
│ user_answers:                                               │
│  - [detailed answer for each question]                      │
│                                                              │
│ user_achievements:                                          │
│  - [new achievement records]                                │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure Summary

```
CoderQuest/
│
├── COMPLETE_SYSTEM_SUBMISSION.md          ← Main deliverable
├── DATABASE_SCHEMA_DETAILED.md            ← DB documentation
├── SYSTEM_ARCHITECTURE_INTEGRATION.md     ← This file
│
├── src/
│   ├── GameUI.jsx                         [Parent Component]
│   │
│   ├── components/
│   │   ├── DialogBox.jsx                  [Child 1]
│   │   ├── QuestPopup.jsx                 [Child 2]
│   │   ├── Lesson.jsx                     [Grandchild 2a]
│   │   ├── Quiz.jsx                       [Grandchild 2b]
│   │   ├── MultipleChoiceQuestion.jsx     [Great-grandchild]
│   │   ├── FillInBlanksQuestion.jsx       [Great-grandchild]
│   │   └── QuizResults.jsx                [Great-grandchild]
│   │
│   ├── hooks/
│   │   └── useGameEvents.js               [Event system]
│   │       ├── useGameEvents()
│   │       ├── useGameEventListener()
│   │       └── useGameEventEmitter()
│   │
│   ├── data/
│   │   └── sampleQuests.js                [Content data]
│   │
│   └── styles/
│       ├── index.scss                     [Global]
│       ├── _variables.scss                [Design tokens]
│       ├── _mixins.scss                   [Utilities]
│       ├── _dialog-box.scss               [DialogBox styles]
│       ├── _quest-popup.scss              [QuestPopup styles]
│       ├── _lesson.scss                   [Lesson styles]
│       ├── _quiz.scss                     [Quiz styles]
│       ├── _multiple-choice.scss          [MCQ styles]
│       ├── _fill-in-blanks.scss           [FIB styles]
│       └── _quiz-results.scss             [Results styles]
│
├── phaser/                                [PSEUDOCODE - To implement]
│   ├── GameScene.js                       [Main game loop]
│   ├── NPCSystem.js                       [NPC behavior]
│   └── MapSystem.js                       [Map transitions]
│
└── backend/                               [PSEUDOCODE - To implement]
    ├── routes/
    │   ├── auth.js
    │   ├── lessons.js
    │   ├── quests.js
    │   ├── quizzes.js
    │   ├── progress.js
    │   └── achievements.js
    │
    └── database/
        └── schema.sql
```

---

## Deployment Checklist

- [ ] Database: Create all tables with schema.sql
- [ ] Backend: Set up Node.js/Express server
- [ ] Backend: Implement REST API endpoints
- [ ] Phaser: Implement game scenes from pseudocode
- [ ] React: Integrate with backend APIs
- [ ] Testing: Unit tests for all components
- [ ] Testing: Integration tests for event flow
- [ ] Security: Implement authentication/authorization
- [ ] Security: Hash passwords and validate inputs
- [ ] Performance: Optimize database queries with indexes
- [ ] Performance: Lazy load assets in Phaser
- [ ] Monitoring: Set up error tracking (Sentry/LogRocket)
- [ ] Documentation: API documentation (Swagger/OpenAPI)
- [ ] Documentation: Component documentation (Storybook)
- [ ] Staging: Deploy to staging environment
- [ ] QA: Full system testing
- [ ] Production: Deploy to production
- [ ] Monitoring: Set up uptime monitoring
- [ ] Analytics: Track user engagement

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Quiz Accuracy** | > 85% | Average user score |
| **Load Time** | < 3s | Page load time |
| **Quiz Completion Rate** | > 70% | Users finishing quests |
| **User Retention** | > 60% | 30-day return rate |
| **Database Query Time** | < 200ms | Average response time |
| **Error Rate** | < 0.1% | Errors per 1000 requests |
| **Mobile Responsiveness** | 100% | Pass Lighthouse audit |
| **Accessibility** | WCAG 2.1 AA | Automated & manual testing |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-28 | Initial submission with full architecture |

---

**END OF SYSTEM DOCUMENTATION**

