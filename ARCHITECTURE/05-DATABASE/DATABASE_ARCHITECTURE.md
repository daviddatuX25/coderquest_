# 🗄️ Database Architecture

**Purpose:** Store game data persistently  
**Database Type:** SQL (MySQL/PostgreSQL)  
**Status:** Schema complete (from COMPLETE_SYSTEM_SUBMISSION.md)

---

## 📋 Overview

Database consists of 12 tables organized in 3 categories:

1. **User Management** (users, user_progress, user_achievements)
2. **Content** (lessons, quests, quizzes, questions)
3. **Tracking** (quiz_results, user_answers)

---

## 🏗️ Table Structure

### Category 1: Users & Progress

#### 1. USERS Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
**Purpose:** User authentication  
**Keys:** PK = user_id, UK = username, email  
**Usage:** Login, identify user for progress tracking

---

#### 2. USER_PROGRESS Table
```sql
CREATE TABLE user_progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT,
    quest_id INT,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completion_percentage INT DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE SET NULL,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    UNIQUE KEY unique_user_quest (user_id, quest_id)
);
```
**Purpose:** Track user progress on lessons and quests  
**Keys:** PK = progress_id, FK = user_id, lesson_id, quest_id  
**Usage:** Know which quests user has started/completed

---

#### 3. USER_ACHIEVEMENTS Table
```sql
CREATE TABLE user_achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_name VARCHAR(200) NOT NULL,
    achievement_description TEXT,
    icon_path VARCHAR(255),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_name)
);
```
**Purpose:** Gamification - track badges/achievements  
**Keys:** PK = achievement_id, FK = user_id  
**Usage:** Award badges when quiz score ≥ 70%

---

### Category 2: Content (Lessons, Quests, Quizzes)

#### 4. LESSONS Table
```sql
CREATE TABLE lessons (
    lesson_id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_title VARCHAR(200) NOT NULL,
    lesson_description TEXT,
    topic_category VARCHAR(100) NOT NULL,
    content_json LONGTEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
**Purpose:** Store lesson content  
**Keys:** PK = lesson_id  
**Usage:** Display theory before quiz  
**Example:**
```json
{
    "lesson_id": 1,
    "lesson_title": "Introduction to Variables",
    "topic_category": "JavaScript Basics",
    "difficulty_level": "beginner",
    "content_json": {
        "sections": [
            {
                "title": "What is a Variable?",
                "text": "A variable is a container for storing data...",
                "codeExample": "const myVar = 5;"
            }
        ]
    }
}
```

---

#### 5. QUESTS Table
```sql
CREATE TABLE quests (
    quest_id INT PRIMARY KEY AUTO_INCREMENT,
    quest_title VARCHAR(200) NOT NULL,
    quest_description TEXT,
    lesson_id INT NOT NULL,
    reward_points INT DEFAULT 100,
    difficulty_level ENUM('easy', 'medium', 'hard'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);
```
**Purpose:** Link lesson to quiz  
**Keys:** PK = quest_id, FK = lesson_id  
**Usage:** NPC offers quest which contains lesson + quiz

---

#### 6. QUIZZES Table
```sql
CREATE TABLE quizzes (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_title VARCHAR(200) NOT NULL,
    quest_id INT NOT NULL,
    passing_score INT DEFAULT 70,
    total_questions INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE CASCADE
);
```
**Purpose:** Quiz metadata  
**Keys:** PK = quiz_id, FK = quest_id  
**Usage:** Get quiz info and passing score

---

#### 7. QUIZ_QUESTIONS Table
```sql
CREATE TABLE quiz_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_type ENUM('multipleChoice', 'fillInBlanks') NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    question_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);
```
**Purpose:** Individual quiz questions  
**Keys:** PK = question_id, FK = quiz_id  
**Usage:** Display each question in quiz

---

#### 8. QUESTION_OPTIONS Table
```sql
CREATE TABLE question_options (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    option_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);
```
**Purpose:** Multiple choice options  
**Keys:** PK = option_id, FK = question_id  
**Usage:** Display answer buttons for MCQ

---

#### 9. QUESTION_ANSWERS Table
```sql
CREATE TABLE question_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    correct_answer VARCHAR(500) NOT NULL,
    answer_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);
```
**Purpose:** Correct answers for fill-in questions  
**Keys:** PK = answer_id, FK = question_id  
**Usage:** Check if user's fill-in answer is correct

---

### Category 3: Results & Tracking

#### 10. QUIZ_RESULTS Table
```sql
CREATE TABLE quiz_results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage INT GENERATED ALWAYS AS (ROUND((score / total_questions) * 100)) STORED,
    passed BOOLEAN GENERATED ALWAYS AS (percentage >= 70) STORED,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);
```
**Purpose:** Store quiz attempt results  
**Keys:** PK = result_id, FK = user_id, quiz_id  
**Usage:** Show score, track progress, check if passed

---

#### 11. USER_ANSWERS Table
```sql
CREATE TABLE user_answers (
    user_answer_id INT PRIMARY KEY AUTO_INCREMENT,
    result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(500),
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (result_id) REFERENCES quiz_results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);
```
**Purpose:** Individual answers (audit trail)  
**Keys:** PK = user_answer_id, FK = result_id, question_id  
**Usage:** Review what user answered, learning analytics

---

#### 12. NPC_CHARACTERS Table
```sql
CREATE TABLE npc_characters (
    npc_id INT PRIMARY KEY AUTO_INCREMENT,
    npc_name VARCHAR(100) NOT NULL,
    character_sprite VARCHAR(255),
    initial_dialog TEXT NOT NULL,
    quest_id INT,
    map_location VARCHAR(100),
    interaction_radius INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id) ON DELETE SET NULL
);
```
**Purpose:** NPC definitions for game  
**Keys:** PK = npc_id, FK = quest_id  
**Usage:** Load NPC data in Phaser scene

---

## 🔗 Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │ (user_id)
└────────┬────────┘
         │
         ├─→ USER_PROGRESS ──→ LESSONS
         │       │
         │       └─→ QUESTS ───→ QUIZZES ──→ QUIZ_QUESTIONS ──┬─→ QUESTION_OPTIONS
         │                                   │                 │
         │                                   └─→ QUESTION_ANSWERS
         │
         ├─→ QUIZ_RESULTS (quiz_id) ──→ QUIZZES
         │       │
         │       └─→ USER_ANSWERS ──→ QUIZ_QUESTIONS
         │
         └─→ USER_ACHIEVEMENTS

NPC_CHARACTERS ──→ QUESTS
```

---

## 💾 Sample Queries

### Query 1: Get NPC with quest data
```sql
SELECT 
    n.npc_id,
    n.npc_name,
    n.initial_dialog,
    q.quest_id,
    q.quest_title,
    l.lesson_id,
    l.lesson_title,
    l.content_json
FROM npc_characters n
LEFT JOIN quests q ON n.quest_id = q.quest_id
LEFT JOIN lessons l ON q.lesson_id = l.lesson_id
WHERE n.npc_id = 1;
```

### Query 2: Get user progress
```sql
SELECT 
    up.progress_id,
    up.quest_id,
    q.quest_title,
    up.status,
    up.completion_percentage,
    up.started_at,
    up.completed_at
FROM user_progress up
LEFT JOIN quests q ON up.quest_id = q.quest_id
WHERE up.user_id = 5
ORDER BY up.updated_at DESC;
```

### Query 3: Get quiz results with answers
```sql
SELECT 
    qr.result_id,
    qr.percentage,
    qr.passed,
    qq.question_id,
    qq.question_text,
    ua.user_answer,
    ua.is_correct
FROM quiz_results qr
LEFT JOIN user_answers ua ON qr.result_id = ua.result_id
LEFT JOIN quiz_questions qq ON ua.question_id = qq.question_id
WHERE qr.user_id = 5 AND qr.quiz_id = 1
ORDER BY qq.question_order;
```

### Query 4: Get user achievements
```sql
SELECT 
    u.username,
    ua.achievement_name,
    ua.achievement_description,
    ua.earned_at
FROM user_achievements ua
JOIN users u ON ua.user_id = u.user_id
WHERE ua.user_id = 5
ORDER BY ua.earned_at DESC;
```

---

## 🚀 API Endpoints (Backend)

These will be called from React to save/fetch data:

### User Progress
```
GET /api/user/:userId/progress
POST /api/user/:userId/progress/quest/:questId
PUT /api/user/:userId/progress/:progressId
```

### Quiz Results
```
GET /api/quiz/:quizId/questions
POST /api/quiz/:quizId/submit
GET /api/user/:userId/results
```

### Content
```
GET /api/npc/:npcId
GET /api/quest/:questId
GET /api/lesson/:lessonId
```

---

## 📊 Data Relationships

### One-to-Many
- User → Multiple progress records
- User → Multiple quiz results
- User → Multiple achievements
- Lesson → Multiple quests
- Quest → Multiple quizzes (usually 1)
- Quiz → Multiple questions
- Question → Multiple options/answers
- Quiz_Result → Multiple user answers

### Unique Constraints
- User can only have ONE progress record per lesson
- User can only have ONE progress record per quest
- User can only have ONE achievement of each type

---

## 🔐 Data Integrity Rules

1. **Cascade Delete:**
   - If user deleted → all their progress/results deleted
   - If lesson deleted → all related quests deleted
   - If quiz deleted → all related questions deleted

2. **Set Null:**
   - If NPC's quest deleted → NPC.quest_id becomes NULL

3. **Constraints:**
   - Score must be 0-100
   - Passing score typically 70%
   - Unique constraints prevent duplicates

---

## 🎯 Future Enhancements

1. **Leaderboard Table** - Top scores
2. **Daily Challenges** - Time-limited quests
3. **Learning Paths** - Ordered sequence of lessons
4. **Analytics Table** - Detailed learning metrics
5. **Badges System** - More achievements

---

## 📝 Setup Instructions

1. Create database: `CREATE DATABASE coderquest;`
2. Copy all CREATE TABLE statements above
3. Run in database
4. Insert sample data (NPCs, lessons, quizzes)
5. Create backend API to query database

---

## 🔗 Related Documentation

- **Database Schema (Full):** COMPLETE_SYSTEM_SUBMISSION.md
- **API Service:** `src/services/apiService.js` (TO DO)
- **Backend:** Would be Node.js + Express (not included yet)

