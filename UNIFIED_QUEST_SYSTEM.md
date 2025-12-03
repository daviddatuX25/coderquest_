# Unified Quest System

## Problem Solved
Previously, game mode and lesson mode had separate, incompatible quest structures:
- **Game Mode**: `{ id, title, lesson, quiz }` (single quest with embedded lesson+quiz)
- **Lesson Mode**: `{ seg_name, type, title, content, 'quiz-data' }` (separate topics and quizzes)

This caused:
- Data sync issues between modes
- UI breaking when trying to convert formats
- Duplicate/conflicting quest definitions
- Prerequisites not enforcing correctly

## Solution: Unified Quest System

### New Architecture

**Single Source of Truth**: `src/data/unifiedQuests.js`

```javascript
// Provides mapping and helper functions for both modes
export const getQuestForGameMode(questId)           // Game mode
export const getLessonSegmentsForQuest(gameQuestId)  // Lesson mode
export const getLessonToGameMapping()                 // Sync mapping
export const getQuizData(questIdOrSegName)           // Either mode
export const getLessonData(questIdOrSegName)         // Either mode
```

### How It Works

**Game Mode:**
- Still uses `SAMPLE_QUESTS` format: `{ id, title, lesson, quiz }`
- Now loaded via `getQuestForGameMode()` from unifiedQuests
- Full control over lesson+quiz pairing

**Lesson Mode:**
- Uses `questsByLevel` format: separate topics and quizzes
- Automatically mapped to game quests via `getLessonToGameMapping()`
- Topics and quizzes linked but independent

**Sync Between Modes:**
```
Lesson Mode: User completes vars-quiz
                    ↓
          Saved as: completedQuests['vars-quiz']
                    ↓
          Mapped via: getLessonToGameMapping()
                    ↓
          Maps to: quest-variables
                    ↓
          Game Mode: Quest unlocked, prerequisites met
```

### Mapping Structure

```
GAME QUEST ID          LESSON SEGMENTS
quest-variables   ←→  [ intro-variables, vars-quiz ]
quest-functions   ←→  [ functions-intro, functions-quiz ]
quest-arrays      ←→  [ arrays-intro, arrays-quiz ]
quest-loops       ←→  [ loops-intro, loops-quiz ]
quest-objects     ←→  [ objects-intro, objects-quiz ]
quest-conditionals←→  [ conditionals-intro, conditionals-quiz ]
quest-promises    ←→  [ promises-intro, promises-quiz ]
```

### File Structure

```
src/data/
├── unifiedQuests.js      (NEW - Central mapping & helpers)
├── sampleQuests.js       (Game mode format)
├── questsByLevel.js      (Lesson mode format)
├── questNormalizer.js    (Still used by lesson mode)
└── progressManager.js    (Uses unified mapping for sync)
```

### Key Functions in unifiedQuests.js

#### `getQuestForGameMode(questId)`
Returns quest in game mode format with lesson + quiz
```javascript
// Game mode NPC setup
const questData = getQuestForGameMode('quest-variables');
// Returns: { id, title, lesson, quiz }
```

#### `getLessonToGameMapping()`
Returns mapping for syncing completed quests
```javascript
// Progress sync
const mapping = getLessonToGameMapping();
// Returns: { 'vars-quiz': 'quest-variables', ... }
```

#### `getQuizData(questIdOrSegName)`
Get quiz questions from either mode
```javascript
const quiz1 = getQuizData('quest-variables');     // Game mode
const quiz2 = getQuizData('vars-quiz');            // Lesson mode
// Both return the same questions
```

#### `getLessonSegmentsForQuest(gameQuestId)`
Get all segments (topics + quizzes) for a game quest
```javascript
const segments = getLessonSegmentsForQuest('quest-variables');
// Returns: [ { seg_name: 'intro-variables', type: 'topic', ... },
//            { seg_name: 'vars-quiz', type: 'quiz-...', ... } ]
```

## Data Flow

### Game Mode → Lesson Mode
1. User completes quiz in game mode: "Variables Quiz"
2. Progress saved: `completedQuests['quest-variables'] = true`
3. Can also map to lesson: `vars-quiz` marked complete
4. User can see progress in lesson mode

### Lesson Mode → Game Mode
1. User completes quiz in lesson mode: "variables-quiz"
2. Progress saved: `completedQuests['vars-quiz'] = true`
3. On game load, sync uses mapping: `vars-quiz → quest-variables`
4. Marks `quest-variables` complete in gameState
5. Next NPC's prerequisite check passes

## Migration Path

### Phase 1 (Current)
- ✅ Both modes work independently
- ✅ Progress syncs between modes
- ✅ Unified mapping ensures consistency

### Phase 2 (Future)
- Could refactor both modes to use same quiz format
- Could create unified UI component for both modes
- Could have shared lesson/quiz renderer

## Testing Checklist

- [ ] Start lesson mode, complete vars-quiz
- [ ] Switch to game mode
- [ ] Verify Variables quest shows as completed
- [ ] Verify Bull NPC (Variables) doesn't show "Start Quest"
- [ ] Verify Sheep NPC (Functions) shows "Complete Prerequisites First"
- [ ] Complete Functions quest in lesson mode
- [ ] Switch to game mode
- [ ] Verify both quests show completed in game state
- [ ] Verify Sheep NPC now shows "Start Quest"

## Benefits

✅ **True Sync**: Both modes use same underlying quest definitions
✅ **Clean Separation**: Each mode uses format that works best for it
✅ **Easy Mapping**: Central location for lesson↔game mappings
✅ **No Duplicate Data**: Single source of truth via helper functions
✅ **Flexible**: Can add new modes/formats by extending helpers
✅ **Maintainable**: One place to update if quest data changes

## Files Modified

1. **src/data/unifiedQuests.js** (NEW)
   - Central hub for all quest operations
   - Mapping logic
   - Helper functions

2. **src/game/scenes/MainScene.js**
   - Updated to import from unifiedQuests
   - Uses `getQuestForGameMode()` instead of direct SAMPLE_QUESTS access
   - Uses `getLessonToGameMapping()` for sync

3. **src/data/progressManager.js**
   - Updated `getLessonToGameQuestMapping()` to use unified mapping
   - Cleaner fallback logic

4. **No Changes Needed**:
   - `SAMPLE_QUESTS` (still works)
   - `questsByLevel` (still works)
   - Game UI components (still use same format)
   - Lesson components (still use same format)
