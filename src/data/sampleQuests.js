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
  },

  quest3: {
    id: 'quest-arrays',
    title: 'Working with Arrays',
    
    lesson: {
      id: 'lesson-arrays',
      title: 'Arrays in JavaScript',
      content: {
        sections: [
          {
            title: 'What is an Array?',
            text: 'An array is an ordered collection of items. It can hold multiple values in a single variable, making it perfect for storing lists of data.'
          },
          {
            title: 'Creating Arrays',
            code: `const fruits = ['apple', 'banana', 'orange'];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, 'hello', true, null];`
          },
          {
            title: 'Accessing Array Elements',
            code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);   // Output: apple
console.log(fruits[1]);   // Output: banana
console.log(fruits.length); // Output: 3`
          },
          {
            title: 'Array Methods',
            list: [
              'push() - adds an item to the end',
              'pop() - removes the last item',
              'shift() - removes the first item',
              'unshift() - adds to the beginning',
              'map() - transforms each element',
              'filter() - creates a new array with selected items'
            ]
          }
        ]
      },
      quizId: 'quiz-arrays'
    },

    quiz: {
      id: 'quiz-arrays',
      title: 'Arrays Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'arr-q1',
          text: 'What does array indexing start at?',
          explanation: 'Array indices in JavaScript start at 0, so the first element is at index 0.',
          options: [
            { id: 'opt1', text: '0', isCorrect: true },
            { id: 'opt2', text: '1', isCorrect: false },
            { id: 'opt3', text: '2', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'arr-q2',
          prompt: 'Complete the code:',
          sentence: 'To add an item to the end of an array, use the [BLANK] method.',
          answers: ['push'],
          explanation: 'The push() method adds one or more elements to the end of an array.'
        }
      ]
    }
  },

  quest4: {
    id: 'quest-loops',
    title: 'Mastering Loops',
    
    lesson: {
      id: 'lesson-loops',
      title: 'Loops in JavaScript',
      content: {
        sections: [
          {
            title: 'Why Use Loops?',
            text: 'Loops allow you to repeat code multiple times without writing it over and over. This makes code cleaner and more maintainable.'
          },
          {
            title: 'For Loop',
            code: `for (let i = 0; i < 5; i++) {
  console.log('Number: ' + i);
}`
          },
          {
            title: 'While Loop',
            code: `let count = 0;
while (count < 5) {
  console.log('Count: ' + count);
  count++;
}`
          },
          {
            title: 'Common Loop Types',
            list: [
              'for - when you know how many times to repeat',
              'while - when the condition is checked before each iteration',
              'do...while - when you want to run at least once',
              'for...of - to loop through array values',
              'forEach - a function that loops through arrays'
            ]
          }
        ]
      },
      quizId: 'quiz-loops'
    },

    quiz: {
      id: 'quiz-loops',
      title: 'Loops Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'loop-q1',
          text: 'Which loop is best when you know exactly how many times you need to repeat?',
          explanation: 'A for loop is ideal when you know the exact number of iterations.',
          options: [
            { id: 'opt1', text: 'while', isCorrect: false },
            { id: 'opt2', text: 'for', isCorrect: true },
            { id: 'opt3', text: 'do...while', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'loop-q2',
          prompt: 'Complete the for loop:',
          sentence: 'for (let i = 0; i < 10; [BLANK]) { /* code */ }',
          answers: ['i++'],
          explanation: 'i++ increments i by 1 on each iteration of the loop.'
        }
      ]
    }
  },

  quest5: {
    id: 'quest-objects',
    title: 'Understanding Objects',
    
    lesson: {
      id: 'lesson-objects',
      title: 'Objects in JavaScript',
      content: {
        sections: [
          {
            title: 'What is an Object?',
            text: 'An object is a collection of key-value pairs that represent a thing. Objects help organize related data and behavior together.'
          },
          {
            title: 'Creating Objects',
            code: `const person = {
  name: 'Alice',
  age: 30,
  job: 'Developer',
  greet: function() {
    console.log('Hello, I am ' + this.name);
  }
};`
          },
          {
            title: 'Accessing Properties',
            code: `console.log(person.name);        // Alice
console.log(person['age']);       // 30
person.age = 31;                  // Update property
person.greet();                   // Method call`
          },
          {
            title: 'Key Concepts',
            list: [
              'Properties: key-value pairs storing data',
              'Methods: functions that belong to an object',
              'this keyword: refers to the object itself',
              'Object literal: {} syntax for creating objects'
            ]
          }
        ]
      },
      quizId: 'quiz-objects'
    },

    quiz: {
      id: 'quiz-objects',
      title: 'Objects Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'obj-q1',
          text: 'How do you access a property called "name" from an object?',
          explanation: 'You can use dot notation (object.name) or bracket notation (object["name"]).',
          options: [
            { id: 'opt1', text: 'object.name', isCorrect: true },
            { id: 'opt2', text: 'object->name', isCorrect: false },
            { id: 'opt3', text: 'object:name', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'obj-q2',
          prompt: 'Complete the object:',
          sentence: 'const car = { brand: "Toyota", color: "red", [BLANK]: function() { console.log(this.brand); } };',
          answers: ['drive', 'honk', 'start'],
          explanation: 'Objects can have methods (functions). Common car methods include drive, honk, or start.'
        }
      ]
    }
  },

  quest6: {
    id: 'quest-promises',
    title: 'Async Programming with Promises',
    
    lesson: {
      id: 'lesson-promises',
      title: 'Promises and Async/Await',
      content: {
        sections: [
          {
            title: 'What are Promises?',
            text: 'A Promise is an object that represents a value that may not be available yet but will be resolved in the future. It handles asynchronous operations.'
          },
          {
            title: 'Promise States',
            list: [
              'Pending: operation hasn\'t completed yet',
              'Fulfilled: operation completed successfully',
              'Rejected: operation failed'
            ]
          },
          {
            title: 'Using Promises',
            code: `const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

myPromise.then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});`
          },
          {
            title: 'Async/Await Syntax',
            code: `async function fetchData() {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}`
          }
        ]
      },
      quizId: 'quiz-promises'
    },

    quiz: {
      id: 'quiz-promises',
      title: 'Promises Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'prom-q1',
          text: 'What does a Promise resolve to when successful?',
          explanation: 'A successful Promise calls its resolve() function with the result value.',
          options: [
            { id: 'opt1', text: 'An error', isCorrect: false },
            { id: 'opt2', text: 'A value using resolve()', isCorrect: true },
            { id: 'opt3', text: 'undefined', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'prom-q2',
          prompt: 'Complete the async function:',
          sentence: '[BLANK] function getData() { const result = await fetchData(); return result; }',
          answers: ['async'],
          explanation: 'Functions that use await must be declared as async.'
        }
      ]
    }
  },

  /**
   * LEVEL 2 QUESTS - TOWN MAP
   * 9 quests covering intermediate to advanced programming concepts
   */
  
  quest7: {
    id: 'quest-data-structures',
    title: 'Data Structures',
    
    lesson: {
      id: 'lesson-data-structures',
      title: 'Understanding Data Structures',
      content: {
        sections: [
          {
            title: 'What are Data Structures?',
            text: 'Data structures are ways to organize and store data efficiently. Different structures are optimized for different operations.'
          },
          {
            title: 'Common Data Structures',
            list: [
              'Array: Ordered collection, fast access by index',
              'Object: Key-value pairs, fast lookup by key',
              'Set: Unique values, great for membership testing',
              'Map: Key-value pairs with any type of key',
              'Stack: LIFO (Last In, First Out)',
              'Queue: FIFO (First In, First Out)'
            ]
          },
          {
            title: 'Choosing the Right Structure',
            code: `// Array - fast indexing
const scores = [95, 87, 92];

// Set - fast membership checking
const uniqueColors = new Set(['red', 'blue', 'red']); // {red, blue}

// Map - flexible keys
const userMap = new Map();
userMap.set('user1', { name: 'Alice' });
userMap.set('user2', { name: 'Bob' });`
          }
        ]
      },
      quizId: 'quiz-data-structures'
    },

    quiz: {
      id: 'quiz-data-structures',
      title: 'Data Structures Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'ds-q1',
          text: 'Which data structure automatically removes duplicate values?',
          explanation: 'A Set automatically maintains unique values and removes duplicates.',
          options: [
            { id: 'opt1', text: 'Array', isCorrect: false },
            { id: 'opt2', text: 'Set', isCorrect: true },
            { id: 'opt3', text: 'Map', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'ds-q2',
          text: 'What is FIFO?',
          explanation: 'FIFO stands for First In, First Out, which is how queues operate.',
          options: [
            { id: 'opt1', text: 'A programming language', isCorrect: false },
            { id: 'opt2', text: 'First In, First Out', isCorrect: true },
            { id: 'opt3', text: 'A type of array', isCorrect: false }
          ]
        }
      ]
    }
  },

  quest8: {
    id: 'quest-debugging',
    title: 'Debugging Techniques',
    
    lesson: {
      id: 'lesson-debugging',
      title: 'Finding and Fixing Bugs',
      content: {
        sections: [
          {
            title: 'What is Debugging?',
            text: 'Debugging is the process of finding and fixing errors (bugs) in your code. Every programmer spends significant time debugging!'
          },
          {
            title: 'Debugging Tools',
            list: [
              'console.log() - print values to see what\'s happening',
              'Browser DevTools - set breakpoints, step through code',
              'Debugger statement - pause code execution',
              'Try/catch - catch and handle errors gracefully'
            ]
          },
          {
            title: 'Debugging Example',
            code: `function calculateTotal(items) {
  console.log('Items received:', items); // Debug: see input
  
  let total = 0;
  for (let item of items) {
    console.log('Adding:', item.price); // Debug: track each addition
    total += item.price;
  }
  
  console.log('Final total:', total); // Debug: verify result
  return total;
}`
          }
        ]
      },
      quizId: 'quiz-debugging'
    },

    quiz: {
      id: 'quiz-debugging',
      title: 'Debugging Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'dbg-q1',
          text: 'What is the simplest way to debug a value?',
          explanation: 'console.log() is the simplest and most common way to debug values in JavaScript.',
          options: [
            { id: 'opt1', text: 'console.log()', isCorrect: true },
            { id: 'opt2', text: 'alert()', isCorrect: false },
            { id: 'opt3', text: 'throw error', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'dbg-q2',
          prompt: 'Complete the debugging statement:',
          sentence: 'debugger [BLANK]',
          answers: ['statement'],
          explanation: 'The debugger statement pauses execution in browser DevTools.'
        }
      ]
    }
  },

  quest9: {
    id: 'quest-testing',
    title: 'Writing Tests',
    
    lesson: {
      id: 'lesson-testing',
      title: 'Unit Testing Basics',
      content: {
        sections: [
          {
            title: 'Why Write Tests?',
            text: 'Tests verify that your code works correctly. They catch bugs early and make refactoring safer by ensuring behavior doesn\'t change.'
          },
          {
            title: 'Testing Concepts',
            list: [
              'Unit Test: tests a single function or component',
              'Assertion: a statement that checks if something is true',
              'Test Suite: a collection of related tests',
              'Test Framework: tool that runs and reports tests (Jest, Vitest, Mocha)'
            ]
          },
          {
            title: 'Simple Test Example',
            code: `function add(a, b) {
  return a + b;
}

// Test: assert that add(2, 3) returns 5
if (add(2, 3) === 5) {
  console.log('✓ Test passed');
} else {
  console.log('✗ Test failed');
}`
          }
        ]
      },
      quizId: 'quiz-testing'
    },

    quiz: {
      id: 'quiz-testing',
      title: 'Testing Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'test-q1',
          text: 'What is a unit test?',
          explanation: 'A unit test is a test that verifies the behavior of a single function or component in isolation.',
          options: [
            { id: 'opt1', text: 'Test that verifies the entire application', isCorrect: false },
            { id: 'opt2', text: 'Test for a single function or component', isCorrect: true },
            { id: 'opt3', text: 'Test for database connections', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'test-q2',
          text: 'Which tool is a popular JavaScript testing framework?',
          explanation: 'Jest is one of the most popular testing frameworks for JavaScript.',
          options: [
            { id: 'opt1', text: 'Jest', isCorrect: true },
            { id: 'opt2', text: 'Django', isCorrect: false },
            { id: 'opt3', text: 'Bootstrap', isCorrect: false }
          ]
        }
      ]
    }
  },

  quest10: {
    id: 'quest-oop-basics',
    title: 'Object-Oriented Programming',
    
    lesson: {
      id: 'lesson-oop-basics',
      title: 'OOP Fundamentals',
      content: {
        sections: [
          {
            title: 'What is OOP?',
            text: 'Object-Oriented Programming is a paradigm where code is organized around objects that contain both data (properties) and behavior (methods).'
          },
          {
            title: 'Core OOP Concepts',
            list: [
              'Class: Blueprint for creating objects',
              'Inheritance: Child classes inherit from parent classes',
              'Encapsulation: Hide internal details, expose clean interface',
              'Polymorphism: Different objects respond differently to same message'
            ]
          },
          {
            title: 'Class Example',
            code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a sound');
  }
}

const dog = new Animal('Dog');
dog.speak(); // Dog makes a sound`
          }
        ]
      },
      quizId: 'quiz-oop-basics'
    },

    quiz: {
      id: 'quiz-oop-basics',
      title: 'OOP Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'oop-q1',
          text: 'What is a class in OOP?',
          explanation: 'A class is a blueprint or template for creating objects with specific properties and methods.',
          options: [
            { id: 'opt1', text: 'A collection of functions', isCorrect: false },
            { id: 'opt2', text: 'Blueprint for creating objects', isCorrect: true },
            { id: 'opt3', text: 'A type of variable', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'oop-q2',
          prompt: 'Complete the class definition:',
          sentence: '[BLANK] Dog { constructor(name) { this.name = name; } }',
          answers: ['class'],
          explanation: 'Classes are defined using the class keyword in JavaScript.'
        }
      ]
    }
  },

  quest11: {
    id: 'quest-api-calls',
    title: 'Working with APIs',
    
    lesson: {
      id: 'lesson-api-calls',
      title: 'API Requests and Data Fetching',
      content: {
        sections: [
          {
            title: 'What is an API?',
            text: 'An API (Application Programming Interface) is a set of rules for how software components communicate. Web APIs let you fetch data from servers.'
          },
          {
            title: 'HTTP Methods',
            list: [
              'GET: Retrieve data (no side effects)',
              'POST: Create new data',
              'PUT: Update existing data',
              'DELETE: Remove data'
            ]
          },
          {
            title: 'Fetching Data',
            code: `// Using fetch API
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Using async/await
async function getUsers() {
  const response = await fetch('https://api.example.com/users');
  const data = await response.json();
  return data;
}`
          }
        ]
      },
      quizId: 'quiz-api-calls'
    },

    quiz: {
      id: 'quiz-api-calls',
      title: 'APIs Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'api-q1',
          text: 'Which HTTP method is used to retrieve data?',
          explanation: 'The GET method is used to retrieve data from a server without causing side effects.',
          options: [
            { id: 'opt1', text: 'POST', isCorrect: false },
            { id: 'opt2', text: 'GET', isCorrect: true },
            { id: 'opt3', text: 'DELETE', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'api-q2',
          text: 'What does JSON stand for?',
          explanation: 'JSON stands for JavaScript Object Notation, a common format for API responses.',
          options: [
            { id: 'opt1', text: 'Java Style Object Naming', isCorrect: false },
            { id: 'opt2', text: 'JavaScript Object Notation', isCorrect: true },
            { id: 'opt3', text: 'Just Official Network', isCorrect: false }
          ]
        }
      ]
    }
  },

  quest12: {
    id: 'quest-async-await',
    title: 'Async/Await Mastery',
    
    lesson: {
      id: 'lesson-async-await',
      title: 'Handling Asynchronous Code',
      content: {
        sections: [
          {
            title: 'Async vs Sync',
            text: 'Synchronous code runs line by line, blocking until each operation completes. Asynchronous code allows operations to run in the background.'
          },
          {
            title: 'Async/Await Syntax',
            list: [
              'async function: function that can contain await',
              'await: pauses execution until Promise resolves',
              'try/catch: handle errors in async code',
              'Cleaner than .then() chains'
            ]
          },
          {
            title: 'Async/Await Pattern',
            code: `async function processData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    const processed = processData(data);
    console.log('Done:', processed);
    
    return processed;
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Call the async function
processData();`
          }
        ]
      },
      quizId: 'quiz-async-await'
    },

    quiz: {
      id: 'quiz-async-await',
      title: 'Async/Await Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'async-q1',
          text: 'Which keyword marks a function as asynchronous?',
          explanation: 'The async keyword declares a function as asynchronous.',
          options: [
            { id: 'opt1', text: 'await', isCorrect: false },
            { id: 'opt2', text: 'async', isCorrect: true },
            { id: 'opt3', text: 'promise', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'async-q2',
          prompt: 'Complete the code:',
          sentence: 'const result = [BLANK] fetchData();',
          answers: ['await'],
          explanation: 'You use await to pause execution until an async operation completes.'
        }
      ]
    }
  },

  quest13: {
    id: 'quest-state-management',
    title: 'State Management',
    
    lesson: {
      id: 'lesson-state-management',
      title: 'Managing Application State',
      content: {
        sections: [
          {
            title: 'What is State?',
            text: 'State is data that changes over time in your application. Managing state properly keeps your application predictable and easier to debug.'
          },
          {
            title: 'State Management Principles',
            list: [
              'Single source of truth: One place where state lives',
              'Immutability: Don\'t modify state directly',
              'Predictability: State changes follow clear patterns',
              'Traceability: Can track how state changed over time'
            ]
          },
          {
            title: 'State Management Patterns',
            code: `// Redux-like pattern
const initialState = { count: 0 };

function reducer(state, action) {
  switch(action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Dispatch actions
const newState = reducer(initialState, { type: 'INCREMENT' });
console.log(newState); // { count: 1 }`
          }
        ]
      },
      quizId: 'quiz-state-management'
    },

    quiz: {
      id: 'quiz-state-management',
      title: 'State Management Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'state-q1',
          text: 'What is the principle of immutability?',
          explanation: 'Immutability means not modifying data directly, but instead creating new copies with changes.',
          options: [
            { id: 'opt1', text: 'State should never change', isCorrect: false },
            { id: 'opt2', text: 'Don\'t modify state directly, create new copies', isCorrect: true },
            { id: 'opt3', text: 'All state must be in one file', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'state-q2',
          text: 'What is a single source of truth?',
          explanation: 'A single source of truth means having one place where your state lives, not scattered across the app.',
          options: [
            { id: 'opt1', text: 'Multiple places to store state', isCorrect: false },
            { id: 'opt2', text: 'One place where application state lives', isCorrect: true },
            { id: 'opt3', text: 'Storing state in local storage', isCorrect: false }
          ]
        }
      ]
    }
  },

  quest14: {
    id: 'quest-design-patterns',
    title: 'Design Patterns',
    
    lesson: {
      id: 'lesson-design-patterns',
      title: 'Common Design Patterns',
      content: {
        sections: [
          {
            title: 'What are Design Patterns?',
            text: 'Design patterns are reusable solutions to common programming problems. They represent best practices and can accelerate development.'
          },
          {
            title: 'Popular Patterns',
            list: [
              'Singleton: Only one instance of a class exists',
              'Factory: Create objects without specifying exact classes',
              'Observer: Objects notify each other of state changes',
              'Strategy: Different algorithms that can be selected at runtime',
              'Module: Encapsulate code to avoid global namespace pollution'
            ]
          },
          {
            title: 'Module Pattern Example',
            code: `// Encapsulate functionality in a module
const Calculator = (() => {
  // Private variable
  let result = 0;
  
  // Public methods
  return {
    add: (num) => { result += num; return result; },
    subtract: (num) => { result -= num; return result; },
    getResult: () => result
  };
})();

Calculator.add(5);        // 5
Calculator.subtract(2);   // 3
console.log(Calculator.getResult()); // 3`
          }
        ]
      },
      quizId: 'quiz-design-patterns'
    },

    quiz: {
      id: 'quiz-design-patterns',
      title: 'Design Patterns Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'dp-q1',
          text: 'What is a Singleton pattern?',
          explanation: 'A Singleton ensures that only one instance of a class can exist in the application.',
          options: [
            { id: 'opt1', text: 'Create multiple instances of a class', isCorrect: false },
            { id: 'opt2', text: 'Ensure only one instance exists', isCorrect: true },
            { id: 'opt3', text: 'A class with no methods', isCorrect: false }
          ]
        },
        {
          type: 'multipleChoice',
          id: 'dp-q2',
          text: 'Which pattern uses private variables and methods?',
          explanation: 'The Module pattern encapsulates code with private and public members.',
          options: [
            { id: 'opt1', text: 'Factory', isCorrect: false },
            { id: 'opt2', text: 'Module', isCorrect: true },
            { id: 'opt3', text: 'Observer', isCorrect: false }
          ]
        }
      ]
    }
  },

  quest15: {
    id: 'quest-best-practices',
    title: 'Best Practices & Performance',
    
    lesson: {
      id: 'lesson-best-practices',
      title: 'Writing Production-Ready Code',
      content: {
        sections: [
          {
            title: 'Code Quality Practices',
            text: 'Best practices ensure your code is maintainable, performant, and secure. They\'re essential for professional development.'
          },
          {
            title: 'Key Best Practices',
            list: [
              'DRY (Don\'t Repeat Yourself): Avoid code duplication',
              'KISS (Keep It Simple, Stupid): Simple solutions over complex ones',
              'Meaningful names: Use clear, descriptive variable names',
              'Comments: Explain why, not what (code shows what)',
              'Error handling: Always handle edge cases and errors',
              'Performance: Optimize for speed and memory',
              'Security: Validate inputs, avoid XSS and injection attacks'
            ]
          },
          {
            title: 'Good Code Examples',
            code: `// ✓ Good: Clear naming and structure
function calculateUserAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

// ✗ Bad: Unclear naming
function calc(y) {
  return new Date().getFullYear() - y;
}

// ✓ Good: Input validation
function divideNumbers(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}`
          }
        ]
      },
      quizId: 'quiz-best-practices'
    },

    quiz: {
      id: 'quiz-best-practices',
      title: 'Best Practices Quiz',
      questions: [
        {
          type: 'multipleChoice',
          id: 'bp-q1',
          text: 'What does DRY stand for?',
          explanation: 'DRY stands for Don\'t Repeat Yourself - avoid duplicating code by using functions and modules.',
          options: [
            { id: 'opt1', text: 'Delete Redundant Yearnings', isCorrect: false },
            { id: 'opt2', text: 'Don\'t Repeat Yourself', isCorrect: true },
            { id: 'opt3', text: 'Debug Runtime Yields', isCorrect: false }
          ]
        },
        {
          type: 'fillInBlanks',
          id: 'bp-q2',
          prompt: 'Complete the principle:',
          sentence: 'KISS means Keep It [BLANK], Stupid',
          answers: ['Simple'],
          explanation: 'KISS encourages choosing simple, straightforward solutions over unnecessarily complex ones.'
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
