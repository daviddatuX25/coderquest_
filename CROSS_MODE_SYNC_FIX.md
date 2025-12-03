# Cross-Mode Quest Sync Fix

## Problem
When you complete quizzes in **Lesson Mode**, switching to **Game Mode** shows all NPCs with "Continue" button, even though only the first quest should be available. The quests appear completed/continued when they shouldn't be accessible yet.

## Root Cause
**Quest Name Mismatch Between Modes:**

**Lesson Mode** uses seg_names from questsByLevel.js:
- `intro-variables`, `vars-quiz`
- `functions-intro`, `functions-quiz`
- `arrays-intro`, `arrays-quiz`
- etc.

**Game Mode** uses quest IDs from npcsByLevel.js:
- `quest-variables`
- `quest-functions`
- `quest-arrays`
- etc.

When you complete a quiz in lesson mode (e.g., `vars-quiz`), it's saved to localStorage as `completedQuests['vars-quiz'] = true`.

When game mode loads, it tries to sync this to gameState, but needs to convert `vars-quiz` → `quest-variables`. If this mapping fails or is incomplete, game mode doesn't know about the completed quest.

## Solution Implemented

### 1. **Enhanced Quest Mapping** (progressManager.js)
- Updated `getLessonToGameQuestMapping()` to explicitly map all lesson quiz names to game mode quest IDs
- Added logging to show what's being mapped
- Handles: vars-quiz → quest-variables, functions-quiz → quest-functions, etc.

### 2. **Improved Sync Logging** (MainScene.js)
- Added detailed logging when syncing completed quests from lesson mode
- Shows which quests were successfully mapped and synced to gameState
- Warns about unmapped quests

### 3. **Enhanced NPC Interaction Logging** (MainScene.js)
- Logs prerequisite checks showing why an NPC quest is locked/unlocked
- Shows which prerequisites are met/unmet
- Displays full NPC interaction details

### 4. **Diagnostic Console Commands**

**In Lesson Mode:**
```javascript
// Check lesson progress and sync mapping
coderquestStatus()

// Check lesson→game mapping
checkGameModeSync()
```

**In Game Mode:**
```javascript
// Comprehensive game mode sync status
gameModeSyncStatus()

// Check specific quest status
checkQuestStatus('vars-quiz')  // or any quest name
```

## How to Test

### Test 1: Lesson Mode → Game Mode Progression
1. Open lesson mode
2. Complete "Introduction to Variables" (topic)
3. Complete "Variables Quiz"
4. Open browser console: `coderquestStatus()`
5. Verify: `✅ Completed Items: 2`
6. Switch to game mode
7. Open console: `gameModeSyncStatus()`
8. Verify: First NPC (Bull/Variables) shows "Start Quest" (available)
9. Verify: Second NPC (Sheep/Functions) shows "Complete Prerequisites First" (locked)

### Test 2: Check Sync Mapping
1. Complete a quiz in lesson mode
2. Open console in lesson: `checkGameModeSync()`
3. Should show mapping with ✅ for completed quests
4. Switch to game mode
5. Open console: `gameModeSyncStatus()`
6. Should show same quests as completed

### Test 3: Fresh Start
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. In lesson mode: `coderquestStatus()` → should show 0 completed
4. In game mode: `gameModeSyncStatus()` → should show 0 completed, only first NPC available

## Quest Name Reference

**Lesson Mode (seg_names):**
```
intro-variables  → vars-quiz
functions-intro  → functions-quiz
arrays-intro     → arrays-quiz
loops-intro      → loops-quiz
objects-intro    → objects-quiz
conditionals-intro → conditionals-quiz
promises-intro   → promises-quiz
```

**Game Mode (quest IDs):**
```
quest-variables
quest-functions
quest-arrays
quest-loops
quest-objects
quest-conditionals
quest-promises
```

## Files Modified

1. **src/data/progressManager.js**
   - Enhanced `getLessonToGameQuestMapping()` with explicit mappings and logging

2. **src/game/scenes/MainScene.js**
   - Added detailed sync logging in `create()` method
   - Added prerequisite check logging in `interactWithNPC()`
   - Added `setupDiagnostics()` method with console commands

3. **src/components/QuestLevelUI.jsx**
   - Added `checkGameModeSync()` diagnostic command

## Debugging Checklist

- [ ] Run `coderquestStatus()` - verify lesson mode progress
- [ ] Run `checkGameModeSync()` - verify lesson→game mapping
- [ ] Complete first quiz
- [ ] Switch to game mode
- [ ] Run `gameModeSyncStatus()` - check if sync worked
- [ ] Verify first NPC has "Start Quest" button
- [ ] Verify second NPC has "Complete Prerequisites First"
- [ ] Interact with first NPC - check console for "All prerequisites met"

## Expected Behavior After Fix

**Lesson Mode:**
- Topics marked as ✅ when "Next" is clicked
- Quizzes marked as ✅ when completed
- Can retry failed quizzes (in progress state shows 🔄)
- Progress shows correct counts

**Game Mode:**
- First NPC: Quest available ("Start Quest" button)
- Subsequent NPCs: Prerequisites locked until previous quiz completed
- Console shows successful sync of completed quests
- NPCs show appropriate prerequisite messages

## Still Debugging?

If quests still show as "continue" when they shouldn't:

1. Check browser console for sync errors
2. Run `gameModeSyncStatus()` and look for ❌ marks
3. Check if quest names in mapping match actual quiz names
4. Verify localStorage has `coderquest_progress` key
5. Clear localStorage and restart if needed: `localStorage.removeItem('coderquest_progress')`
