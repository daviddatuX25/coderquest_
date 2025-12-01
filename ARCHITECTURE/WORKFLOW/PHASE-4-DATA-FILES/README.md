# PHASE 4: DATA FILES - README

**Duration:** 1-2 days  
**Effort:** Low-Medium (creating data files)  
**Complexity:** Simple (data structure creation)  
**Goal:** All game content loaded and accessible

---

## 🎯 Phase 4 Overview

Phase 3 built the systems. Phase 4 fills them with **data**.

You'll create:
- ✅ NPC definitions (npcs.js)
- ✅ Map definitions (maps.js)
- ✅ Quest definitions (quests.js)
- ✅ DataLoader system

By end of Phase 4, all game content is ready!

---

## 🗂️ Phase 4 Structure

```
PHASE 4: DATA FILES
├── Step 1: NPC Data (01-NPC-DATA.md)
│   ├─ Create data/npcs.js
│   ├─ Define 3-5 NPCs
│   └─ Test loading
│
├── Step 2: Map Data (02-MAP-DATA.md)
│   ├─ Create data/maps.js
│   ├─ Define jungle, town, city maps
│   └─ Test loading
│
├── Step 3: Quest Data (03-QUEST-DATA.md)
│   ├─ Create data/quests.js
│   ├─ Define quests with lessons/quizzes
│   └─ Test loading
│
└── Step 4: DataLoader (04-LOAD-DATA.md)
    ├─ Create data/DataLoader.js
    ├─ Load all data on startup
    ├─ Make accessible to systems
    └─ Test everything loads
```

---

## ✅ Phase 4 Success Criteria

By end of this phase:

1. ✅ NPCs load from data
2. ✅ Maps load from data
3. ✅ Quests load from data
4. ✅ No data errors
5. ✅ All content accessible
6. ✅ Game world fully populated
7. ✅ No console errors
8. ✅ Ready for integration

If all 8 are true → **Phase 4 complete!** ✅

---

## 📊 Time Breakdown

| Step | File | Duration | Focus |
|------|------|----------|-------|
| 1 | 01-NPC-DATA.md | 20-30 min | NPCs |
| 2 | 02-MAP-DATA.md | 20-30 min | Maps |
| 3 | 03-QUEST-DATA.md | 30-45 min | Quests |
| 4 | 04-LOAD-DATA.md | 30-45 min | Loader |
| **Total** | **All 4** | **2-3 hours** | **All data ready** |

---

## 📋 Data Structure

### NPCs (3-5 per map)
```javascript
{
  id: 1,
  name: "Elder",
  x: 200, y: 300,
  dialog: "Welcome to CoderQuest!",
  questId: 1
}
```

### Maps (3 maps)
```javascript
{
  id: "jungle",
  name: "Jungle",
  tilemapPath: "/assets/maps/jungle.json",
  npcs: [1, 2, 3]
}
```

### Quests (Multiple quests)
```javascript
{
  id: 1,
  title: "Learn Variables",
  npcId: 1,
  lessons: [...],
  quiz: {...}
}
```

---

## 🎯 What You'll Create

### New Files
```
src/data/
├── npcs.js (50-100 lines)
├── maps.js (50-100 lines)
├── quests.js (100-200 lines)
└── DataLoader.js (50-100 lines)
```

---

## 🚀 Let's Build Phase 4!

### Next: Open `01-NPC-DATA.md`

**Go there now!** ▶️

---

## 🎉 When Phase 4 is Complete

You'll have:
- ✅ All NPC data
- ✅ All map data
- ✅ All quest data
- ✅ Data loading system
- ✅ Game fully populated

**Next:** Phase 5 (Integration)

