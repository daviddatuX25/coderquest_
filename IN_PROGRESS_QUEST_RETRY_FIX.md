# In-Progress Quest Retry Fix

## Problem
Users could NOT access or retry quizzes that were in progress (started but not completed). Only completed quizzes would unlock the next item.

Example scenario:
- User completes Topic 1
- User starts Quiz 1 and answers some questions
- User closes the quiz
- On reload, Quiz 1 was LOCKED and user couldn't retry it

## Root Cause
The unlock logic in QuestLevelUI.jsx only checked if the PREVIOUS item was completed:
```javascript
// OLD LOGIC (too restrictive)
unlockedState[i] = !!progress.completedQuests[prevQuest.seg_name];
```

This prevented:
1. Retrying failed quizzes
2. Continuing interrupted quizzes
3. Starting the current quiz while previous was marked complete

## Solution
Updated unlock logic to unlock an item if EITHER:
1. Previous item is COMPLETED, OR
2. Current item is IN PROGRESS (user has attempted it)

```javascript
// NEW LOGIC (allows retry and continuation)
const prevCompleted = !!progress.completedQuests[prevQuest.seg_name];
const isInProgress = !!progress.questResults[currentQuest.seg_name];
unlockedState[i] = prevCompleted || isInProgress;
```

## Files Modified
**src/components/QuestLevelUI.jsx**

Three functions updated with consistent unlock logic:

1. **loadSampleQuest()** (lines 60-95)
   - Initial unlock state calculation on component mount
   - Checks both completedQuests and questResults

2. **nextQuestion()** (lines 166-195)
   - Recalculates unlocks after quiz completion
   - Applies same logic to ensure consistency

3. **next()** (lines 264-302)
   - Recalculates unlocks after topic completion
   - Uses same unlock rules as other functions

## How questResults Works
- **questResults**: localStorage object tracking quiz attempts
- When a user answers ANY question in a quiz, that quiz gets an entry in questResults
- If `questResults[quizName]` exists, user has already attempted that quiz
- This enables retry detection and in-progress access

## Behavior Changes

### Before
```
Topic 1 (completed) → Quiz 1 (locked until completed) → Quiz 2 (locked)
```

### After
```
Topic 1 (completed) → Quiz 1 (unlocked, can retry) → Quiz 2 (locked until Quiz 1 completed)

User can:
✅ Attempt Quiz 1
✅ Fail Quiz 1 and reload
✅ Retry Quiz 1 on reload
✅ Complete Quiz 1 to unlock Quiz 2
```

## Testing Checklist
- [ ] Start a quiz and answer 1-2 questions
- [ ] Close/reload page
- [ ] Verify quiz is still accessible (unlocked)
- [ ] Attempt quiz again (retry)
- [ ] Complete quiz
- [ ] Verify next item unlocks

## Related Systems
- **progressManager.js**: Tracks questResults on quiz attempt
- **GameStateManager.js**: Used in game mode (may need similar fix if applied there)
- **MainScene.js**: Game mode quest handling (currently doesn't have this issue)
