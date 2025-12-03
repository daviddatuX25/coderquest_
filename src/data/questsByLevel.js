/**
 * Quest Segments for Level 1
 * Comprehensive lesson and quiz progression
 */

export const level1Quests = [
  // ===== VARIABLES TOPIC =====
  {
    seg_name: 'intro-variables',
    type: 'topic',
    title: 'Introduction to Variables',
    content: '<p>Variables are containers for storing data. Think of them as labeled boxes where you can put different types of information.</p><p><strong>Key Points:</strong></p><ul><li>Variables store values</li><li>Each variable has a name and value</li><li>You can change variable values</li></ul>'
  },
  {
    seg_name: 'vars-quiz',
    type: 'quiz-multichoice',
    title: 'Variables Quiz',
    'quiz-data': {
      questions: [
        {
          qid: 'var1',
          question: 'What is a variable?',
          choices: [
            'A container for storing data',
            'A function definition',
            'A loop statement',
            'A comment'
          ],
          answer: 0,
          answerDisplay: 'A container for storing data'
        },
        {
          qid: 'var2',
          question: 'Which is a valid variable name?',
          choices: [
            '123name',
            'name-123',
            'name_123',
            'name 123'
          ],
          answer: 2,
          answerDisplay: 'name_123'
        }
      ]
    }
  },

  // ===== FUNCTIONS TOPIC =====
  {
    seg_name: 'functions-intro',
    type: 'topic',
    title: 'Introduction to Functions',
    content: '<p>Functions are reusable blocks of code that perform a specific task. Functions help organize code and make it DRY (Don\'t Repeat Yourself).</p><p><strong>Benefits:</strong></p><ul><li>Reusable code blocks</li><li>Easier to maintain</li><li>Better organization</li></ul>'
  },
  {
    seg_name: 'functions-quiz',
    type: 'quiz-identification',
    title: 'Functions Identification',
    'quiz-data': {
      questions: [
        {
          qid: 'func1',
          question: 'What do you call the values passed to a function?',
          answer: 'parameters',
          answerDisplay: 'parameters'
        },
        {
          qid: 'func2',
          question: 'What keyword declares a function in JavaScript?',
          answer: 'function',
          answerDisplay: 'function'
        }
      ]
    }
  },

  // ===== ARRAYS TOPIC =====
  {
    seg_name: 'arrays-intro',
    type: 'topic',
    title: 'Introduction to Arrays',
    content: '<p>Arrays are collections of values stored in a single variable. Arrays allow you to store multiple items in one container.</p><p><strong>Array Basics:</strong></p><ul><li>Arrays store multiple values</li><li>Each item has an index starting from 0</li><li>Access items using bracket notation</li></ul>'
  },
  {
    seg_name: 'arrays-quiz',
    type: 'quiz-multichoice',
    title: 'Arrays Quiz',
    'quiz-data': {
      questions: [
        {
          qid: 'arr1',
          question: 'How do you create an array in JavaScript?',
          choices: [
            'array = {}',
            'array = []',
            'array = ()',
            'array = <>'
          ],
          answer: 1,
          answerDisplay: 'array = []'
        },
        {
          qid: 'arr2',
          question: 'What is the index of the first element in an array?',
          choices: [
            '1',
            '0',
            '-1',
            'first'
          ],
          answer: 1,
          answerDisplay: '0'
        }
      ]
    }
  },

  // ===== LOOPS TOPIC =====
  {
    seg_name: 'loops-intro',
    type: 'topic',
    title: 'Introduction to Loops',
    content: '<p>Loops allow you to repeat code multiple times. This is essential for processing arrays and automating repetitive tasks.</p><p><strong>Loop Types:</strong></p><ul><li>for loops - repeat a specific number of times</li><li>while loops - repeat while a condition is true</li><li>forEach - iterate over array items</li></ul>'
  },
  {
    seg_name: 'loops-quiz',
    type: 'quiz-identification',
    title: 'Loops Identification',
    'quiz-data': {
      questions: [
        {
          qid: 'loop1',
          question: 'Which keyword starts a for loop?',
          answer: 'for',
          answerDisplay: 'for'
        },
        {
          qid: 'loop2',
          question: 'What loop repeats while a condition is true?',
          answer: 'while',
          answerDisplay: 'while'
        }
      ]
    }
  },

  // ===== OBJECTS TOPIC =====
  {
    seg_name: 'objects-intro',
    type: 'topic',
    title: 'Introduction to Objects',
    content: '<p>Objects store related data and functions together. Objects use key-value pairs to organize information.</p><p><strong>Object Features:</strong></p><ul><li>Store multiple related values</li><li>Use properties to access values</li><li>Can contain methods (functions)</li></ul>'
  },
  {
    seg_name: 'objects-quiz',
    type: 'quiz-multichoice',
    title: 'Objects Quiz',
    'quiz-data': {
      questions: [
        {
          qid: 'obj1',
          question: 'How do you create an object in JavaScript?',
          choices: [
            'object = []',
            'object = {}',
            'object = ()',
            'object = <>'
          ],
          answer: 1,
          answerDisplay: 'object = {}'
        },
        {
          qid: 'obj2',
          question: 'What is a key-value pair in an object called?',
          choices: [
            'element',
            'property',
            'method',
            'function'
          ],
          answer: 1,
          answerDisplay: 'property'
        }
      ]
    }
  },

  // ===== CONDITIONALS TOPIC =====
  {
    seg_name: 'conditionals-intro',
    type: 'topic',
    title: 'Introduction to Conditionals',
    content: '<p>Conditionals allow your code to make decisions based on conditions. Use if/else statements to execute different code blocks.</p><p><strong>Decision Making:</strong></p><ul><li>if - execute if condition is true</li><li>else - execute if condition is false</li><li>else if - check multiple conditions</li></ul>'
  },
  {
    seg_name: 'conditionals-quiz',
    type: 'quiz-identification',
    title: 'Conditionals Identification',
    'quiz-data': {
      questions: [
        {
          qid: 'cond1',
          question: 'What keyword is used to check a condition?',
          answer: 'if',
          answerDisplay: 'if'
        },
        {
          qid: 'cond2',
          question: 'What keyword executes code when condition is false?',
          answer: 'else',
          answerDisplay: 'else'
        }
      ]
    }
  },

  // ===== PROMISES TOPIC =====
  {
    seg_name: 'promises-intro',
    type: 'topic',
    title: 'Introduction to Promises',
    content: '<p>Promises handle asynchronous operations. A promise represents a value that may not be available yet but will be resolved eventually.</p><p><strong>Promise States:</strong></p><ul><li>Pending - operation hasn\'t completed</li><li>Resolved - operation succeeded</li><li>Rejected - operation failed</li></ul>'
  },
  {
    seg_name: 'promises-quiz',
    type: 'quiz-multichoice',
    title: 'Promises Quiz',
    'quiz-data': {
      questions: [
        {
          qid: 'prom1',
          question: 'What does a Promise represent?',
          choices: [
            'A synchronous operation',
            'An asynchronous operation that may resolve or reject',
            'A variable declaration',
            'A loop statement'
          ],
          answer: 1,
          answerDisplay: 'An asynchronous operation that may resolve or reject'
        },
        {
          qid: 'prom2',
          question: 'What are the three states of a Promise?',
          choices: [
            'start, middle, end',
            'pending, resolved, rejected',
            'true, false, null',
            'active, inactive, dormant'
          ],
          answer: 1,
          answerDisplay: 'pending, resolved, rejected'
        }
      ]
    }
  },

  // ===== FINAL SUMMARY =====
  {
    seg_name: 'level-1-summary',
    type: 'topic',
    title: 'Level 1 - Congratulations!',
    content: '<h3>🎉 You completed Level 1!</h3><p>You\'ve learned the fundamentals of JavaScript:</p><ul><li>✓ Variables - storing data</li><li>✓ Functions - reusable code</li><li>✓ Arrays - collections</li><li>✓ Loops - repetition</li><li>✓ Objects - organization</li><li>✓ Conditionals - decision making</li><li>✓ Promises - async operations</li></ul><p><strong>Next:</strong> Level 2 awaits with more advanced concepts!</p>'
  }
];

export const getAllQuests = () => {
  return level1Quests;
};
