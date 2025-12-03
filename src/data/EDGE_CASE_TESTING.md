# Edge Case Testing Guide

## System Overview

The CoderQuest system now implements comprehensive level completion detection and cross-mode synchronization. This document outlines all edge cases and how to test them.

### Key Components
- **progressManager.js** - Centralized progress tracking with localStorage
- **modeSynchronizer.js** - Cross-mode sync logic and edge case handling
- **QuestLevelUI.jsx** - Lesson mode with level completion detection
- **MainScene.js** - Game mode with progress-aware level loading
- **MainMenu.jsx** - Shows level progress and handles mode switching

---

## Edge Case Scenarios

### Scenario 1: Complete Level 1 in Lesson Mode → Switch to Game Mode

**Setup:**
1. Start app, click "Lessons & Quizzes Only"
2. Complete all 7 quizzes in Level 1

**Expected Behavior:**
- After last quiz: level completion is detected, localStorage updated
- Level shows as "Complete" in MainMenu
- Switch back to MainMenu, click "Start Game"
- Game should load (currently Level 1, but marked complete in progress)

**Test Steps:**
```
1. Open app → "Lessons & Quizzes Only"
2. Click through topics 1-2 (Variables intro + Variables quiz)
3. Click through topics 3-4 (Functions intro + Functions quiz)
4. Click through topics 5-6 (Arrays intro + Arrays quiz)
5. Click through topics 7-8 (Loops intro + Loops quiz)
6. Click through topics 9-10 (Objects intro + Objects quiz)
7. Click through topics 11-12 (Conditionals intro + Conditionals quiz)
8. Complete topic 13-14 (Promises intro + Promises quiz)
9. Notice: Level completion detected, UI shows 100% complete
10. Open MainMenu → Progress bar shows 100%
11. Click "Start Game" → Game loads, player at starting position
12. Console should show: "Player progress: Currently on Level 1"
```

**Verification:**
- ✅ localStorage has `completedLevel` for Level 1
- ✅ All 7 quizzes marked as completed
- ✅ Main menu shows 100% progress
- ✅ Game mode recognizes level completion

---

### Scenario 2: Partial Progress in Lesson Mode → Switch to Game Mode

**Setup:**
1. Start app, click "Lessons & Quizzes Only"
2. Complete only 2 quizzes (Variables, Functions)
3. Switch to game mode

**Expected Behavior:**
- Game loads at same level with same progress
- Player position at Level 1
- If player completes remaining quizzes in game later, progress continues from where lesson mode left off

**Test Steps:**
```
1. Open app → "Lessons & Quizzes Only"
2. Complete Variables quiz (topics 1-2)
3. Complete Functions quiz (topics 3-4)
4. Open MainMenu → Progress shows 28% complete (2 of 7 quizzes)
5. Click "Start Game"
6. Verify: Game loads, player at Level 1
7. If later: Complete a quest through NPC dialogue in game
8. Switch back to lesson mode
9. Verify: Same 2 quizzes still complete + new game progress
```

**Verification:**
- ✅ Lesson mode progress preserved when switching to game
- ✅ Game mode progress merged with lesson mode progress
- ✅ Progress bar reflects combined completion

---

### Scenario 3: Quit and Resume (Same Mode)

**Setup:**
1. Start game or lesson mode
2. Make some progress
3. Close browser/app
4. Reopen and start in same mode

**Expected Behavior:**
- Progress restored exactly where it was
- Same level, same quizzes completed

**Test Steps:**
```
1. Open app → "Lessons & Quizzes Only"
2. Complete 3 quizzes
3. Close browser entirely
4. Reopen app
5. Click "Lessons & Quizzes Only" again
6. Verify: Same 3 quizzes still shown as completed
7. Verify: Progress bar at correct percentage
```

**Verification:**
- ✅ localStorage persists across browser sessions
- ✅ Progress restored exactly
- ✅ currentLevel in localStorage matches UI display

---

### Scenario 4: Cross-Mode Progress Accumulation

**Setup:**
1. Do Quiz 1 in game mode (through NPC dialogue)
2. Switch to lesson mode, do Quiz 2
3. Switch back to game mode
4. Check that both quizzes are marked complete

**Expected Behavior:**
- Single source of truth in localStorage
- All progress accumulated regardless of mode
- Progress bar shows combined completion

**Test Steps:**
```
1. Start Game → Interact with NPC, complete quest/quiz
2. Open MainMenu, note progress percentage
3. Switch to "Lessons & Quizzes Only"
4. Complete another quiz
5. Check MainMenu progress (should show both)
6. Switch back to Game
7. Verify: Game recognizes quiz from lesson mode
```

**Verification:**
- ✅ Both quizzes marked in localStorage
- ✅ No duplicate entries
- ✅ Progress percentage accurate (combined)

---

### Scenario 5: Resume After Session End

**Setup:**
1. Use app in one mode (game or lesson)
2. Make partial progress
3. Close browser
4. Wait (optional: clear other tabs, restart browser)
5. Reopen app

**Expected Behavior:**
- Level restored correctly
- Progress restored correctly
- Last mode recorded (but start at menu)

**Test Steps:**
```
1. Open app → Start Game
2. Play for a bit, progress to 20-30%
3. Close browser completely
4. Wait 1 minute
5. Reopen app
6. Verify: MainMenu shows 20-30% progress
7. Click "Start Game" again
8. Verify: Game loads at correct level
9. Click "Lessons & Quizzes Only"
10. Verify: Same progress shown there too
```

**Verification:**
- ✅ localStorage intact after session end
- ✅ Progress bar shows correct percentage
- ✅ Level number correct
- ✅ Mode detection works

---

### Scenario 6: Level Completion Boundary

**Setup:**
1. Have 6 of 7 quizzes completed
2. Complete the final quiz

**Expected Behavior:**
- Last quiz completion triggers level completion
- `completeLevel(1)` is called
- `completedLevels` updated in localStorage
- `currentLevel` updated (preparation for Level 2)
- UI shows celebration/transition

**Test Steps:**
```
1. Complete 6 out of 7 quizzes in lesson mode
2. Complete the 7th quiz
3. Watch for level completion detection
4. Console should show: "Level complete! Moving to Level 2"
5. localStorage should update completedLevels.level1 = true
```

**Verification:**
- ✅ Event emitted: `levelCompleted`
- ✅ localStorage.completedLevels updated
- ✅ Summary screen shows after last quiz
- ✅ currentLevel updated for next session

---

### Scenario 7: Mode Switch During Mid-Level

**Setup:**
1. Start in game mode
2. Complete a few quests (progress to 30%)
3. Switch to lesson mode mid-way
4. Switch back to game mode

**Expected Behavior:**
- All progress preserved
- Can continue from same point
- No progress loss on mode switch

**Test Steps:**
```
1. Start Game
2. Complete partial progress (visit 1-2 NPCs)
3. Open MainMenu, switch to "Lessons & Quizzes Only"
4. Complete a quiz in lesson mode
5. Switch back to "Start Game"
6. Verify: Game shows combined progress
7. Verify: No progress lost
```

**Verification:**
- ✅ Game-only quests still visible
- ✅ Lesson-only quests combined with game quests
- ✅ Progress bar reflects total

---

## Debugging Checklist

### Console Logs to Watch For

**On Game Start:**
```
✅ "Player progress: Currently on Level X"
```

**On Mode Switch:**
```
✅ "🎮 Starting game: { level: X, levelCompleted: false/true }"
✅ "📚 Starting UI-only mode: { level: X }"
```

**On Quiz Completion (Lesson Mode):**
```
✅ "Quiz completed: questId"
✅ "✅ Progress saved"
✅ (If level complete) "Level complete! Moving to Level X+1"
```

**On Menu Updates:**
```
✅ Progress bar width updated
✅ Level badge shows current level
```

---

## localStorage Structure

After each test, check browser DevTools → Application → localStorage:

```json
{
  "coderquest_progress": {
    "currentLevel": 1,
    "completedQuests": {
      "intro-variables": { score: 85, results: {...} },
      "vars-quiz": { score: 100, results: {...} },
      ...
    },
    "completedLevels": {
      "level1": true  // Set when all quizzes done
    },
    "lastMode": "full" // or "ui-only"
  }
}
```

---

## Quick Test Script

Run this in browser console after various actions:

```javascript
// Check current progress state
console.log('Progress State:', JSON.parse(localStorage.getItem('coderquest_progress')));

// Test level completion detection
const { isLevelCompleted } = window.progressManager;
console.log('Level 1 Complete:', isLevelCompleted(getAllQuests()));

// Test sync metadata
const { getSyncMetadata } = window.modeSynchronizer;
console.log('Sync Metadata:', getSyncMetadata());

// Test edge case scenarios
const { getEdgeCaseTests } = window.modeSynchronizer;
console.log('Edge Cases:', getEdgeCaseTests());
```

---

## Common Issues & Solutions

### Issue: Progress not showing in MainMenu
**Solution:** 
- Check if `getAllQuests()` is returning full array
- Verify localStorage is being read by `getProgress()`
- Check browser console for errors

### Issue: Level not advancing after completion
**Solution:**
- Verify `completeLevel()` is called after last quiz
- Check if `levelCompleted` event is emitted
- Verify `completedLevels` in localStorage

### Issue: WASD not disabled in lesson mode
**Solution:**
- Check if `inputDisabled` event is emitted from QuestLevelUI
- Verify MainScene has event listener for `inputDisabled`
- Check if `inputHandler.disable()` is called

### Issue: Progress lost on mode switch
**Solution:**
- Verify `completeQuest()` called for each quiz
- Check if same key used in localStorage
- Verify no conflicting event listeners overwriting data

---

## Manual Test Checklist

- [ ] Scenario 1: Complete Level 1 lesson → play game
- [ ] Scenario 2: Partial lesson progress → game mode
- [ ] Scenario 3: Quit and resume same mode
- [ ] Scenario 4: Mix quizzes between modes
- [ ] Scenario 5: Session end and resume
- [ ] Scenario 6: Level completion at boundary
- [ ] Scenario 7: Mid-level mode switch
- [ ] WASD disabled in lesson mode
- [ ] Progress bar accurate across modes
- [ ] localStorage persists correctly
- [ ] Console shows all expected logs
- [ ] No UI glitches on mode transition
- [ ] Menu shows correct level info
- [ ] Game loads correct level for progress
- [ ] No progress loss on any mode change

---

## Performance Notes

- localStorage reads are synchronous and fast (~1ms)
- Level detection happens on component mount/update
- Progress updates happen on quiz completion only
- No polling or continuous checks needed

---

## Future Enhancements

When Level 2+ content is added:
1. Create `questsByLevel.js` entries for Level 2
2. Update `getMapKeyForLevel()` in MainScene
3. Update `getCurrentLevel()` logic if needed
4. Add Level 2 NPC data to `npcsByLevel.js`
5. Test all edge cases with multiple levels
