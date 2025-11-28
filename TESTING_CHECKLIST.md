# 🧪 Testing Checklist - React Component System

## Pre-Testing Setup

- [ ] Server is running (XAMPP or http-server)
- [ ] Browser console is open (F12)
- [ ] Game loads at http://localhost/CoderQuest/
- [ ] No JavaScript errors in console
- [ ] Window.gameEvents exists in console

## Component Functionality Tests

### DialogBox Component ✅

#### Opening Dialog
- [ ] Press **D** key in game → Dialog appears
- [ ] Dialog has backdrop overlay
- [ ] Dialog animates in (slide up)
- [ ] Dialog has NPC name displayed
- [ ] Dialog has NPC sprite visible
- [ ] Dialog has dialog text readable

#### Interaction
- [ ] Click "Continue" button → Dialog closes
- [ ] Click backdrop → Dialog closes
- [ ] Click X button → Dialog closes
- [ ] Dialog animates out smoothly
- [ ] Can't interact with game during dialog

#### Responsive
- [ ] Dialog looks good on mobile (< 480px)
- [ ] Dialog looks good on tablet (768px)
- [ ] Dialog looks good on desktop (1024px+)
- [ ] Text is readable on all sizes
- [ ] Buttons are clickable on all sizes

### QuestPopup Component ✅

#### Opening Quest
- [ ] Press **Q** key → Quest popup appears
- [ ] Popup has backdrop overlay
- [ ] Popup animates in (slide up)
- [ ] Popup has close button visible

#### Lesson Display
- [ ] Lesson title displays correctly
- [ ] Lesson content displays
- [ ] Content sections are visible
- [ ] Code blocks display with syntax highlighting
- [ ] Bullet lists display correctly
- [ ] "Start Quiz →" button is visible
- [ ] Content is scrollable if too long

#### Quiz Transition
- [ ] Click "Start Quiz →" → Lesson hides
- [ ] Quiz appears with fade animation
- [ ] Quiz title displays
- [ ] First question loads
- [ ] Progress bar shows 0%

#### Closing
- [ ] Click X button → Popup closes
- [ ] Click backdrop → Popup closes
- [ ] Popup animates out smoothly

### Quiz Component ✅

#### Progress Tracking
- [ ] Progress bar updates after each question
- [ ] Progress percentage displays correctly
- [ ] Question counter shows "1 of X"
- [ ] Counter updates as you progress

#### Question Display
- [ ] Question text displays clearly
- [ ] Question type is identified (MC or Fill)
- [ ] All question content is visible

### Multiple Choice Questions ✅

#### Option Display
- [ ] All 3 options display
- [ ] Options are buttons with text
- [ ] Options have nice styling (border, hover effect)

#### Selection
- [ ] Click option → Option highlights
- [ ] Highlight color is visible
- [ ] Can select each option

#### Feedback
- [ ] After selection → Feedback appears
- [ ] Correct answer shows "✓ Correct!" in green
- [ ] Wrong answer shows "✗ Incorrect" in red
- [ ] Explanation displays below feedback

#### Progression
- [ ] After feedback → Auto-advance after 1.5s
- [ ] Next question loads
- [ ] Progress bar updates

### Fill in the Blanks Questions ✅

#### Input Display
- [ ] Sentence displays with blank lines
- [ ] Input fields appear at blank locations
- [ ] [BLANK] markers are replaced with inputs

#### User Input
- [ ] Can type in input fields
- [ ] Text appears as typed
- [ ] Can clear text with backspace
- [ ] Multiple blanks work independently

#### Submission
- [ ] "Check Answer" button is visible
- [ ] Click button → Validates answers
- [ ] Press Enter → Also validates
- [ ] Button disables after submission

#### Feedback
- [ ] Correct answers show green background
- [ ] Incorrect answers show red background
- [ ] Feedback message appears
- [ ] Explanation displays
- [ ] Correct answers show if you were wrong

### Quiz Results ✅

#### Score Display
- [ ] Large score circle appears
- [ ] Percentage displays in circle
- [ ] Number is correct (correct/total * 100)

#### Statistics
- [ ] "Correct: X" displays
- [ ] "Total: X" displays
- [ ] Numbers are accurate

#### Feedback Message
- [ ] Feedback matches score:
  - 100% → "Perfect Score!"
  - 80%+ → "Great job!"
  - 70%+ → "Good effort!"
  - 50%+ → "Keep practicing!"
  - <50% → "Don't give up!"
- [ ] Message tone is appropriate

#### Pass/Fail Status
- [ ] Score >= 70% → Shows "You passed!"
- [ ] Score < 70% → Shows "You didn't pass"
- [ ] Styling matches status

#### Action Buttons
- [ ] "Retry Quiz" button works
  - Clicking → Quiz resets to question 1
  - Score resets to 0
  - All answers cleared
- [ ] "Back to Lesson" button works
  - Clicking → Returns to lesson
  - Lesson content is preserved
  - Quiz is reset

## Event System Tests ✅

### Event Emission
- [ ] Press **D** → `showDialog` event emits
- [ ] Press **Q** → `showQuest` event emits
- [ ] Close dialog → `dialogClosed` event emits
- [ ] Complete quiz → `questCompleted` event emits

### Event Reception
- [ ] React receives `showDialog` → Component opens
- [ ] React receives `showQuest` → Component opens
- [ ] Phaser receives `questCompleted` → Console logs

### Console Verification
- [ ] Open DevTools Console (F12)
- [ ] Press D → See event in console
- [ ] Press Q → See event in console
- [ ] Check `window.gameEvents` exists
- [ ] Manually emit: `window.gameEvents.emit('showDialog', {name: 'Test', dialog: 'Hello'})`

## Styling Tests ✅

### Colors
- [ ] Primary blue (#3b82f6) used correctly
- [ ] Green for success (#10b981)
- [ ] Red for errors (#ef4444)
- [ ] Correct buttons are green
- [ ] Incorrect buttons are red
- [ ] Hover states change color

### Spacing
- [ ] Padding looks consistent
- [ ] Margins are balanced
- [ ] Not too cramped on mobile
- [ ] Not too spaced on desktop

### Typography
- [ ] Text is readable
- [ ] Font sizes vary appropriately
- [ ] Bold titles stand out
- [ ] Normal text is clear
- [ ] Code blocks use monospace font

### Animations
- [ ] Dialog slides in smoothly
- [ ] Dialogs fade out smoothly
- [ ] Buttons scale on hover
- [ ] Feedback slides in
- [ ] Transitions are smooth (200-300ms)
- [ ] No animation lag

### Responsiveness
- [ ] Mobile (< 480px) - Single column
- [ ] Tablet (768px) - Larger components
- [ ] Desktop (1024px) - Full layout
- [ ] All text readable on all sizes
- [ ] Touch targets large enough on mobile

## Performance Tests ✅

### Load Time
- [ ] Page loads in under 3 seconds
- [ ] No console errors on load
- [ ] Components render quickly

### Interaction Speed
- [ ] Dialog opens instantly
- [ ] Quiz loads without delay
- [ ] Button clicks are responsive
- [ ] No lag when typing in inputs

### Memory
- [ ] Open/close dialog multiple times (no memory leak)
- [ ] Complete quiz multiple times (no errors)
- [ ] Switch between components (smooth)

## Accessibility Tests ✅

### Keyboard Navigation
- [ ] Tab through buttons
- [ ] Enter/Space activates buttons
- [ ] Escape closes dialogs
- [ ] All interactive elements accessible

### Focus Indicators
- [ ] Buttons show focus ring (outline)
- [ ] Focus ring is visible
- [ ] Focus ring is consistent color

### Color Contrast
- [ ] Text on background is readable
- [ ] Correct/incorrect colors are distinct
- [ ] No text is too light or dark

### Screen Reader (if testing)
- [ ] Button labels are clear
- [ ] Dialog is announced
- [ ] Progress is described

## Edge Cases ✅

### Empty/Null Data
- [ ] Render with missing NPC name
- [ ] Render with empty dialog text
- [ ] Handle missing quiz data gracefully

### Long Content
- [ ] Long lesson text scrolls
- [ ] Long question text wraps
- [ ] Long answers fit in input

### Rapid Interaction
- [ ] Click buttons rapidly - no errors
- [ ] Submit quiz quickly - handles correctly
- [ ] Open/close multiple dialogs - no lag

### Browser DevTools
- [ ] Console has no errors
- [ ] Console has no warnings
- [ ] Network tab shows all assets load
- [ ] React DevTools shows components properly

## Browser Testing ✅

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Final Verification ✅

- [ ] All tests passed ✓
- [ ] No console errors ✓
- [ ] Smooth animations ✓
- [ ] Responsive on all sizes ✓
- [ ] Events working correctly ✓
- [ ] User can complete full flow ✓

## Test Flow (Complete Scenario)

```
1. Start game
2. Press D → Dialog shows ✓
3. Close dialog ✓
4. Press Q → Quest shows ✓
5. Read lesson ✓
6. Click "Start Quiz" ✓
7. Answer 1st question (MC) ✓
8. See feedback ✓
9. Auto-advance to next ✓
10. Answer 2nd question (Fill) ✓
11. See feedback ✓
12. View results ✓
13. Click "Retry" ✓
14. Quiz resets ✓
15. Click "Back to Lesson" ✓
16. Close popup ✓
```

## Notes for Testers

- Test on at least 2 devices (mobile + desktop)
- Try both keyboard and mouse/touch
- Check console regularly (F12)
- Test both happy path and edge cases
- Document any bugs found
- Report unexpected behavior

## Bug Report Template

```
TITLE: [Component Name] - [Brief Description]

EXPECTED:
What should happen?

ACTUAL:
What actually happened?

STEPS TO REPRODUCE:
1. Step 1
2. Step 2
3. Step 3

BROWSER:
[Chrome/Firefox/Safari] Version X.X

DEVICE:
[Desktop/Mobile] - [Screen size]

CONSOLE ERRORS:
[Any JavaScript errors?]

SCREENSHOT:
[If possible, attach screenshot]
```

---

✅ **All tests completed successfully = System is ready for production!**
