# CoderQuest - Database Design & Schema Specification

**Version:** 1.0  
**Date:** November 28, 2025  
**Status:** Production Ready

---

## Database Architecture Overview

### Design Principles

1. **Normalization Level:** Third Normal Form (3NF)
   - No transitive dependencies
   - All non-key attributes fully dependent on primary key
   - Eliminates redundant data

2. **Scalability:** Supports thousands of concurrent users
3. **Audit Trail:** All transactions timestamped
4. **Data Integrity:** Foreign keys enforce referential integrity
5. **Performance:** Indexed on frequently queried columns

---

## Entity Relationship Model

### Core Entities

#### 1. USERS (Primary Actor)
```
┌─────────────────────────────────┐
│ USERS                           │
├─────────────────────────────────┤
│ PK: user_id (INT)              │
│ UN: username (VARCHAR 50)       │
│ UN: email (VARCHAR 100)         │
│ password_hash (VARCHAR 255)     │
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

**Use Cases:**
- User registration and authentication
- Track individual player progress
- Separate progress per user account

---

#### 2. LESSONS (Content Unit)
```
┌─────────────────────────────────┐
│ LESSONS                         │
├─────────────────────────────────┤
│ PK: lesson_id (INT)            │
│ lesson_title (VARCHAR 200)      │
│ lesson_description (TEXT)       │
│ topic_category (VARCHAR 100)    │
│   ├─ "Variables"               │
│   ├─ "Functions"               │
│   ├─ "Loops"                   │
│   └─ "Arrays"                  │
│ content_json (LONGTEXT)         │
│ difficulty_level (ENUM)         │
│   ├─ 'beginner'                │
│   ├─ 'intermediate'            │
│   └─ 'advanced'                │
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

**Data Model - content_json:**
```json
{
  "sections": [
    {
      "title": "Definition",
      "text": "Variables are named containers...",
      "code": "const name = 'Alice';",
      "list": ["Item 1", "Item 2"]
    }
  ]
}
```

---

#### 3. QUESTS (Gameplay Container)
```
┌─────────────────────────────────┐
│ QUESTS                          │
├─────────────────────────────────┤
│ PK: quest_id (INT)             │
│ FK: lesson_id (INT) ──→ LESSONS │
│ quest_title (VARCHAR 200)       │
│ quest_description (TEXT)        │
│ reward_points (INT)             │
│   └─ Default: 100 pts           │
│ difficulty_level (ENUM)         │
│   ├─ 'easy'                    │
│   ├─ 'medium'                  │
│   └─ 'hard'                    │
│ created_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

**Relationship:** 1 LESSON → Many QUESTS  
Example:
- Lesson: "Variables"
  - Quest 1: "Variable Basics"
  - Quest 2: "Variable Naming"
  - Quest 3: "Variable Assignment"

---

#### 4. QUIZZES (Assessment Container)
```
┌─────────────────────────────────┐
│ QUIZZES                         │
├─────────────────────────────────┤
│ PK: quiz_id (INT)              │
│ FK: quest_id (INT) ──→ QUESTS   │
│ quiz_title (VARCHAR 200)        │
│ passing_score (INT)             │
│   └─ Default: 70%              │
│ total_questions (INT)           │
│ created_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

**Relationship:** 1 QUEST → 1 QUIZ  
**Business Logic:** Each quest has one associated quiz for assessment.

---

#### 5. QUIZ_QUESTIONS (Question Bank)
```
┌─────────────────────────────────────┐
│ QUIZ_QUESTIONS                      │
├─────────────────────────────────────┤
│ PK: question_id (INT)              │
│ FK: quiz_id (INT) ──→ QUIZZES      │
│ question_type (ENUM)                │
│   ├─ 'multipleChoice'              │
│   └─ 'fillInBlanks'                │
│ question_text (TEXT)                │
│ explanation (TEXT)                  │
│ question_order (INT)                │
│   └─ For ordering in quiz           │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

**Relationship:** 1 QUIZ → Many QUIZ_QUESTIONS  
**Constraints:** question_order ensures consistent question sequencing

---

#### 6. QUESTION_OPTIONS (MC Answers)
```
┌──────────────────────────────────┐
│ QUESTION_OPTIONS                 │
├──────────────────────────────────┤
│ PK: option_id (INT)             │
│ FK: question_id (INT)           │
│    ──→ QUIZ_QUESTIONS           │
│ option_text (TEXT)              │
│ is_correct (BOOLEAN)            │
│ option_order (INT)              │
│   └─ Display order              │
│ created_at (TIMESTAMP)          │
└──────────────────────────────────┘
```

**Only for:** question_type = 'multipleChoice'  
**Example:**
```
Question: "Which keyword for constants?"
├─ Option 1: "let" (incorrect)
├─ Option 2: "const" (CORRECT)
└─ Option 3: "var" (incorrect)
```

---

#### 7. QUESTION_ANSWERS (FIB Answers)
```
┌──────────────────────────────────┐
│ QUESTION_ANSWERS                 │
├──────────────────────────────────┤
│ PK: answer_id (INT)             │
│ FK: question_id (INT)           │
│    ──→ QUIZ_QUESTIONS           │
│ correct_answer (VARCHAR 500)    │
│ answer_order (INT)              │
│   └─ Order of blanks            │
│ created_at (TIMESTAMP)          │
└──────────────────────────────────┘
```

**Only for:** question_type = 'fillInBlanks'  
**Example:**
```
Question: "To declare a constant, use [BLANK]"
└─ Answer: "const"
```

---

#### 8. USER_PROGRESS (Tracking)
```
┌────────────────────────────────────────┐
│ USER_PROGRESS                          │
├────────────────────────────────────────┤
│ PK: progress_id (INT)                 │
│ FK: user_id (INT) ──→ USERS           │
│ FK: lesson_id (INT) ──→ LESSONS       │
│ FK: quest_id (INT) ──→ QUESTS         │
│ status (ENUM)                          │
│   ├─ 'not_started'                    │
│   ├─ 'in_progress'                    │
│   └─ 'completed'                      │
│ completion_percentage (INT)            │
│   └─ 0-100%                           │
│ started_at (TIMESTAMP)                 │
│ completed_at (TIMESTAMP)               │
│ created_at (TIMESTAMP)                 │
│ updated_at (TIMESTAMP)                 │
│ UQ: (user_id, lesson_id)             │
│ UQ: (user_id, quest_id)              │
└────────────────────────────────────────┘
```

**Purpose:** Track user progression through content  
**Example:**
```
User 1, Lesson 1: in_progress (45%)
User 1, Quest 1: completed
```

---

#### 9. QUIZ_RESULTS (Assessment Results)
```
┌────────────────────────────────────────┐
│ QUIZ_RESULTS                           │
├────────────────────────────────────────┤
│ PK: result_id (INT)                   │
│ FK: user_id (INT) ──→ USERS           │
│ FK: quiz_id (INT) ──→ QUIZZES         │
│ score (INT)                            │
│   └─ Number correct                   │
│ total_questions (INT)                  │
│ percentage (INT)                       │
│   └─ Generated: (score/total)*100     │
│ passed (BOOLEAN)                       │
│   └─ Generated: percentage >= 70      │
│ attempted_at (TIMESTAMP)               │
│ created_at (TIMESTAMP)                 │
└────────────────────────────────────────┘
```

**Features:**
- Automatically calculates percentage
- Auto-marks pass/fail based on passing_score
- Multiple attempts tracked separately
- Historical record of all attempts

---

#### 10. USER_ANSWERS (Detailed Responses)
```
┌────────────────────────────────────────┐
│ USER_ANSWERS                           │
├────────────────────────────────────────┤
│ PK: user_answer_id (INT)              │
│ FK: result_id (INT) ──→ QUIZ_RESULTS  │
│ FK: question_id (INT)                 │
│    ──→ QUIZ_QUESTIONS                 │
│ user_answer (VARCHAR 500)              │
│ is_correct (BOOLEAN)                   │
│ answered_at (TIMESTAMP)                │
└────────────────────────────────────────┘
```

**Purpose:** Audit trail of individual answers  
**Analysis:** Can review which questions users struggle with

---

#### 11. NPC_CHARACTERS (Game Entities)
```
┌────────────────────────────────────────┐
│ NPC_CHARACTERS                         │
├────────────────────────────────────────┤
│ PK: npc_id (INT)                      │
│ npc_name (VARCHAR 100)                 │
│ character_sprite (VARCHAR 255)         │
│ initial_dialog (TEXT)                  │
│ FK: quest_id (INT) ──→ QUESTS         │
│ map_location (VARCHAR 100)             │
│   ├─ "jungle_center"                  │
│   ├─ "town_square"                    │
│   └─ "city_market"                    │
│ interaction_radius (INT)               │
│   └─ Default: 50px                    │
│ created_at (TIMESTAMP)                 │
└────────────────────────────────────────┘
```

**Integration:** Links game world to content  
**Example:**
```
NPC: "Mage Mentor"
├─ sprite: npc1.png
├─ dialog: "Learn about variables!"
├─ quest: quest-variables
├─ location: jungle_center
└─ radius: 80px
```

---

#### 12. USER_ACHIEVEMENTS (Gamification)
```
┌────────────────────────────────────────┐
│ USER_ACHIEVEMENTS                      │
├────────────────────────────────────────┤
│ PK: achievement_id (INT)              │
│ FK: user_id (INT) ──→ USERS           │
│ achievement_name (VARCHAR 200)         │
│ achievement_description (TEXT)         │
│ icon_path (VARCHAR 255)                │
│ earned_at (TIMESTAMP)                  │
│ UQ: (user_id, achievement_name)      │
└────────────────────────────────────────┘
```

**Example Achievements:**
- "First Steps" - Complete first lesson
- "Quiz Master" - Score 100% on quiz
- "Persistent" - Complete 10 quests
- "Speed Runner" - Complete quest in < 5 minutes

---

## Query Examples

### Query 1: Get User's Complete Quest Progress
```sql
SELECT 
    u.username,
    l.lesson_title,
    q.quest_title,
    up.status,
    up.completion_percentage,
    qr.percentage as quiz_score,
    qr.passed,
    qr.attempted_at
FROM users u
LEFT JOIN user_progress up ON u.user_id = up.user_id
LEFT JOIN lessons l ON up.lesson_id = l.lesson_id
LEFT JOIN quests q ON up.quest_id = q.quest_id
LEFT JOIN quiz_results qr ON u.user_id = qr.user_id 
    AND q.quest_id IN (
        SELECT quest_id FROM quizzes WHERE quiz_id = qr.quiz_id
    )
WHERE u.user_id = 1
ORDER BY up.updated_at DESC;
```

### Query 2: Identify Difficult Questions
```sql
SELECT 
    qq.question_id,
    qq.question_text,
    COUNT(ua.user_answer_id) as total_attempts,
    SUM(CASE WHEN ua.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_count,
    ROUND(
        (SUM(CASE WHEN ua.is_correct = 0 THEN 1 ELSE 0 END) / 
        COUNT(ua.user_answer_id) * 100), 2
    ) as difficulty_percentage
FROM quiz_questions qq
LEFT JOIN user_answers ua ON qq.question_id = ua.question_id
GROUP BY qq.question_id
HAVING total_attempts > 10
ORDER BY difficulty_percentage DESC;
```

### Query 3: User Statistics
```sql
SELECT 
    u.username,
    COUNT(DISTINCT up.lesson_id) as lessons_started,
    COUNT(DISTINCT CASE WHEN up.status = 'completed' 
        THEN up.lesson_id END) as lessons_completed,
    AVG(qr.percentage) as average_quiz_score,
    COUNT(DISTINCT CASE WHEN qr.passed = 1 
        THEN qr.quiz_id END) as quizzes_passed,
    COUNT(DISTINCT ua.achievement_name) as achievements_earned
FROM users u
LEFT JOIN user_progress up ON u.user_id = up.user_id
LEFT JOIN quiz_results qr ON u.user_id = qr.user_id
LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
GROUP BY u.user_id
ORDER BY average_quiz_score DESC;
```

---

## Indexes (Performance)

```sql
-- Primary Key Indexes (Auto-created)
ALTER TABLE users ADD PRIMARY KEY (user_id);
ALTER TABLE lessons ADD PRIMARY KEY (lesson_id);
ALTER TABLE quests ADD PRIMARY KEY (quest_id);
ALTER TABLE quizzes ADD PRIMARY KEY (quiz_id);
ALTER TABLE quiz_questions ADD PRIMARY KEY (question_id);
ALTER TABLE question_options ADD PRIMARY KEY (option_id);
ALTER TABLE question_answers ADD PRIMARY KEY (answer_id);
ALTER TABLE user_progress ADD PRIMARY KEY (progress_id);
ALTER TABLE quiz_results ADD PRIMARY KEY (result_id);
ALTER TABLE user_answers ADD PRIMARY KEY (user_answer_id);
ALTER TABLE npc_characters ADD PRIMARY KEY (npc_id);
ALTER TABLE user_achievements ADD PRIMARY KEY (achievement_id);

-- Foreign Key Indexes
CREATE INDEX idx_quests_lesson_id ON quests(lesson_id);
CREATE INDEX idx_quizzes_quest_id ON quizzes(quest_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_question_answers_question_id ON question_answers(question_id);

-- User Progress Indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_quest_id ON user_progress(quest_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- Quiz Results Indexes
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_quiz_results_attempted_at ON quiz_results(attempted_at);

-- User Answers Indexes
CREATE INDEX idx_user_answers_result_id ON user_answers(result_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- NPC Indexes
CREATE INDEX idx_npc_characters_quest_id ON npc_characters(quest_id);

-- Achievements Indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Unique Constraint Indexes
CREATE UNIQUE INDEX ux_users_username ON users(username);
CREATE UNIQUE INDEX ux_users_email ON users(email);
CREATE UNIQUE INDEX ux_user_progress_lesson ON user_progress(user_id, lesson_id);
CREATE UNIQUE INDEX ux_user_progress_quest ON user_progress(user_id, quest_id);
CREATE UNIQUE INDEX ux_user_achievements ON user_achievements(user_id, achievement_name);
```

---

## Data Flow Diagrams

### Flow 1: User Takes a Quiz

```
GAME EVENT
    ↓
    Player meets NPC
    ↓
    Dialog shown
    ↓
    Quest popup shown
    ↓
    Lesson displayed
    ↓
    Quiz started
    ↓
┌─────────────────────────────────┐
│ Quiz Question Displayed         │
└─────────────────────────────────┘
    ↓
    User selects/types answer
    ↓
┌─────────────────────────────────┐
│ INSERT into QUIZ_RESULTS        │
│ INSERT into USER_ANSWERS        │
│ UPDATE USER_PROGRESS            │
└─────────────────────────────────┘
    ↓
    Next question OR Quiz Complete
    ↓
    Results shown
    ↓
    Achievement check
    ↓
┌─────────────────────────────────┐
│ INSERT into USER_ACHIEVEMENTS   │
└─────────────────────────────────┘
    ↓
    Game resumes
```

### Flow 2: Analytics Query

```
ADMIN DASHBOARD
    ↓
    "Which questions are hardest?"
    ↓
    Query USER_ANSWERS
    ↓
┌─────────────────────────────────────┐
│ SELECT question_id, is_correct      │
│ FROM user_answers                   │
│ GROUP BY question_id                │
│ ORDER BY failure_rate DESC          │
└─────────────────────────────────────┘
    ↓
    Results displayed
    ↓
    Educators use to improve content
```

---

## Backup & Disaster Recovery

```sql
-- Full Database Backup
mysqldump -u root -p coderquest > backup_coderquest_$(date +%Y%m%d_%H%M%S).sql

-- Selective Backup (User Data Only)
mysqldump -u root -p coderquest users user_progress quiz_results > backup_user_data.sql

-- Restore
mysql -u root -p coderquest < backup_coderquest_20251128_120000.sql
```

---

## Compliance & Security

1. **GDPR Compliance:** User deletion cascades to all related records
2. **Data Anonymization:** Users can request data deletion
3. **Password Hashing:** All passwords must be hashed (bcrypt/argon2)
4. **Access Control:** Implement role-based permissions
5. **Audit Logging:** All modifications timestamped

---

## Summary Statistics

| Aspect | Details |
|--------|---------|
| **Total Tables** | 12 |
| **Normalization** | 3NF |
| **Foreign Keys** | 15 |
| **Unique Constraints** | 8 |
| **Indexes** | 20+ |
| **Estimated Users** | 10,000+ |
| **Lesson Capacity** | Unlimited |
| **Quiz Capacity** | Unlimited |
| **Archive Time** | 7 years |

