/**
 * Sample Quest Data for Testing
 * Contains complete quest structures with lessons and quizzes
 */

export const SAMPLE_QUESTS = {
  quest1: {
    id: 'quest-variables',
    title: 'Understanding Variables',
    
    lesson: {
      id: 'lesson-variables',
      title: 'What are Variables?',
      content: {
        sections: [
          {
            title: 'Definition',
            text: 'Variables are named containers that store data values. Think of them as labeled boxes where you can put information to use later in your program.'
          },
          {
            title: 'Declaration in JavaScript',
            text: 'JavaScript has three ways to declare variables:',
            list: [
              'const - for constants that cannot be reassigned (preferred)',
              'let - for variables that can change (block-scoped)',
              'var - older way (function-scoped, avoid in modern code)'
            ]
          },
          {
            title: 'Example',
            code: `const name = 'Alice';      // Cannot be changed
let age = 25;              // Can be changed
age = 26;                  // This is allowed
var oldStyle = 'outdated'; // Don't use this`
          },
          {
            title: 'Naming Rules',
            list: [
              'Variable names are case-sensitive (name ≠ Name)',
              'Must start with a letter, underscore, or dollar sign',
              'Can contain letters, numbers, underscores, or dollar signs',
              'Use camelCase for multi-word variables (myVariableName)'
            ]
          }
        ]
      },
      quizId: 'quiz-variables'
    },

    quiz: {
      id: 'quiz-variables',
      title: 'Variables Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'var-q1',
          text: 'Which keyword should you use for values that should never be reassigned?',
          explanation: 'const is the best choice for values that should not change after being set.',
          options: [
            { id: 'opt1', text: 'let', isCorrect: false },
            { id: 'opt2', text: 'const', isCorrect: true },
            { id: 'opt3', text: 'var', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'var-q2',
          text: 'What is the correct way to name a variable with multiple words?',
          explanation: 'camelCase is the JavaScript convention: first word lowercase, subsequent words capitalized.',
          options: [
            { id: 'opt1', text: 'my_variable_name', isCorrect: false },
            { id: 'opt2', text: 'myVariableName', isCorrect: true },
            { id: 'opt3', text: 'MyVariableName', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'var-q3',
          prompt: 'Complete the code:',
          sentence: 'To declare a variable that cannot be reassigned, use the [BLANK] keyword.',
          answers: ['const'],
          explanation: 'const creates a constant that cannot be reassigned after initialization.'
        },
        {
          type: 'fillInBlanks',
          id: 'var-q4',
          prompt: 'Fill in the missing part:',
          sentence: 'In JavaScript, variable names are [BLANK] (case matters).',
          answers: ['case-sensitive', 'casesensitive'],
          explanation: 'Variable names in JavaScript are case-sensitive, so "name" and "Name" are different variables.'
        }
      ]
    }
  },

  quest2: {
    id: 'quest-functions',
    title: 'Understanding Functions',
    
    lesson: {
      id: 'lesson-functions',
      title: 'Functions in JavaScript',
      content: {
        sections: [
          {
            title: 'What is a Function?',
            text: 'A function is a reusable block of code that performs a specific task. Functions help us avoid repeating code and make our programs more organized.'
          },
          {
            title: 'Function Declaration',
            code: `function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('Alice');  // Output: Hello, Alice!
greet('Bob');    // Output: Hello, Bob!`
          },
          {
            title: 'Arrow Functions (Modern Syntax)',
            code: `const add = (a, b) => {
  return a + b;
};

console.log(add(5, 3));  // Output: 8`
          },
          {
            title: 'Key Concepts',
            list: [
              'Parameters: variables in the function definition',
              'Arguments: actual values passed when calling the function',
              'Return statement: sends a value back to the caller',
              'Scope: variables inside functions are local'
            ]
          }
        ]
      },
      quizId: 'quiz-functions'
    },

    quiz: {
      id: 'quiz-functions',
      title: 'Functions Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'func-q1',
          text: 'What is the main purpose of using functions?',
          explanation: 'Functions allow us to write reusable code, making programs more organized and maintainable.',
          options: [
            { id: 'opt1', text: 'To make code shorter', isCorrect: false },
            { id: 'opt2', text: 'To reuse code and improve organization', isCorrect: true },
            { id: 'opt3', text: 'To add colors to the program', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'func-q2',
          text: 'What does the "return" statement do in a function?',
          explanation: 'The return statement sends a value back to whoever called the function.',
          options: [
            { id: 'opt1', text: 'Exits the program', isCorrect: false },
            { id: 'opt2', text: 'Sends a value back to the caller', isCorrect: true },
            { id: 'opt3', text: 'Prints to the console', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'func-q3',
          prompt: 'Complete the function:',
          sentence: 'function multiply(a, b) { [BLANK] a * b; }',
          answers: ['return'],
          explanation: 'We use the return keyword to send the result back from a function.'
        }
      ]
    }
  }
};

// Sample NPC dialog
export const SAMPLE_NPC_DIALOG = {
  npc1: {
    name: 'Mage Mentor',
    dialog: 'Welcome, young programmer! I will teach you the fundamentals of JavaScript. Let\'s start with variables!',
    sprite: 'npc1'
  },
  npc2: {
    name: 'Scholar',
    dialog: 'Functions are the building blocks of any good program. Master them, and you\'ll be unstoppable!',
    sprite: 'npc2'
  },
  npc3: {
    name: 'Code Master',
    dialog: 'Have you completed the quiz? Show me what you\'ve learned!',
    sprite: 'npc3'
  }
};

// Export specific quests for easy access
export const VARIABLES_QUEST = SAMPLE_QUESTS.quest1;
export const FUNCTIONS_QUEST = SAMPLE_QUESTS.quest2;
