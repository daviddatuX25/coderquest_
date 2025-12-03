/**
 * NPC Configuration by Level
 * Defines all NPCs for each level with their:
 * - Sprite key (for rendering)
 * - Spawn position (from tilemap object layer)
 * - Dialog text
 * - Assigned quest ID
 * - Prerequisites (quests that must be completed first)
 * - Quest order (for tracking progress)
 */

/**
 * LEVEL 1 - JUNGLE MAP
 * 6 NPCs progressing through core programming concepts
 * Prerequisites create a learning path: Variables → Functions → Arrays → Loops → Objects → Promises
 */
export const LEVEL_1_NPCS = [
  {
    id: 'npc-mentor',
    name: 'The Mighty Bull',
    spriteKey: 'animal_bull', // Bull NPC
    dialogText: 'Greetings, young coder! I am the Mighty Bull, guardian of Variables. Just as a strong foundation supports a great structure, variables are the foundation of all code. They store the data that powers your programs. Are you ready to learn their secrets?',
    questId: 'quest-variables',
    questOrder: 1,
    prerequisites: [] // First quest, no prerequisites
  },
  {
    id: 'npc-scholar',
    name: 'The Wise Sheep',
    spriteKey: 'animal_sheep', // Sheep NPC
    dialogText: 'Baaah, welcome traveler! I am the Wise Sheep, keeper of Functions. Like a shepherd guides their flock, functions guide your code and organize it into manageable tasks. Through functions, complex problems become simple solutions. Shall we explore this wisdom together?',
    questId: 'quest-functions',
    questOrder: 2,
    prerequisites: ['quest-variables'] // Must complete Variables first
  },
  {
    id: 'npc-wizard',
    name: 'The Clever Rooster',
    spriteKey: 'animal_rooster', // Rooster NPC
    dialogText: 'Cock-a-doodle-doo! I am the Clever Rooster, master of Arrays! Just as I wake the village with my crow, arrays awaken the true power of your code by holding many values in one place. With arrays, you can store collections of data and process them with grace. Ready for this adventure?',
    questId: 'quest-arrays',
    questOrder: 3,
    prerequisites: ['quest-functions'] // Must complete Functions first
  },
  {
    id: 'npc-warrior',
    name: 'The Swift Lamb',
    spriteKey: 'animal_lamb', // Lamb NPC
    dialogText: 'Hello young coder, I am the Swift Lamb, champion of Loops! Like a lamb that frolics endlessly through the meadows, loops repeat your code again and again, saving you from endless typing. Loops are the key to handling repetition and automation. Are you ready to discover their speed?',
    questId: 'quest-loops',
    questOrder: 4,
    prerequisites: ['quest-arrays'] // Must complete Arrays first
  },
  {
    id: 'npc-sage',
    name: 'The Proud Turkey',
    spriteKey: 'animal_turkey', // Turkey NPC
    dialogText: 'Gobble gobble! I am the Proud Turkey, sage of Objects. Objects are collections of properties and methods, much like how I collect my magnificent feathers. They let you organize complex data and behaviors into single, powerful entities. Objects are where code becomes truly elegant. Shall we begin?',
    questId: 'quest-objects',
    questOrder: 5,
    prerequisites: ['quest-loops'] // Must complete Loops first
  },
  {
    id: 'npc-rogue',
    name: 'The Clever Piglet',
    spriteKey: 'animal_piglet', // Piglet NPC
    dialogText: 'Oink oink! I am the Clever Piglet, holder of Promises! Promises are like promises I make to my friends - they say "I will do something eventually, either successfully or not." They are how you handle asynchronous code, waiting for long tasks to complete. This is your final test before mastery. Are you ready?',
    questId: 'quest-promises',
    questOrder: 6,
    prerequisites: ['quest-objects'] // Must complete Objects first
  }
]

/**
 * LEVEL 2 - TOWN MAP
 * 9 NPCs progressing through intermediate to advanced programming concepts
 * Prerequisites allow for more flexible learning paths
 */
export const LEVEL_2_NPCS = [
  {
    id: 'npc-townkeeper',
    name: 'Town Keeper',
    spriteKey: 'npc_girl', // Human NPC
    dialogText: 'Welcome to town! Let me teach you about Data Structures!',
    questId: 'quest-data-structures',
    questOrder: 1,
    prerequisites: ['quest-promises'] // From Level 1
  },
  {
    id: 'npc-merchant',
    name: 'Merchant',
    spriteKey: 'npc_girl', // Human NPC
    dialogText: 'Interested in my wares? Learn about Debugging first!',
    questId: 'quest-debugging',
    questOrder: 2,
    prerequisites: ['quest-promises'] // From Level 1
  },
  {
    id: 'npc-scholar-2',
    name: 'Scholar Elder',
    spriteKey: 'npc_girl', // Human NPC
    dialogText: 'The ancient knowledge of Testing awaits you!',
    questId: 'quest-testing',
    questOrder: 3,
    prerequisites: ['quest-data-structures', 'quest-debugging'] // Must learn DS and Debug first
  },
  {
    id: 'npc-engineer',
    name: 'Engineer',
    spriteKey: 'animal_bull', // Bull NPC
    dialogText: 'Ever heard of Object-Oriented Programming? I can teach you!',
    questId: 'quest-oop-basics',
    questOrder: 4,
    prerequisites: ['quest-data-structures'] // Must learn Data Structures first
  },
  {
    id: 'npc-librarian',
    name: 'Librarian',
    spriteKey: 'animal_sheep', // Sheep NPC
    dialogText: 'Endless books about APIs! Want to learn?',
    questId: 'quest-api-calls',
    questOrder: 5,
    prerequisites: ['quest-oop-basics', 'quest-testing'] // Must learn OOP and Testing
  },
  {
    id: 'npc-guard',
    name: 'City Guard',
    spriteKey: 'animal_rooster', // Rooster NPC
    dialogText: 'Protecting the city requires knowledge of Async/Await!',
    questId: 'quest-async-await',
    questOrder: 6,
    prerequisites: ['quest-api-calls'] // Must learn API calls first
  },
  {
    id: 'npc-artisan',
    name: 'Artisan',
    spriteKey: 'animal_lamb', // Lamb NPC
    dialogText: 'Crafting beautiful code with State Management! Join me!',
    questId: 'quest-state-management',
    questOrder: 7,
    prerequisites: ['quest-oop-basics'] // Must learn OOP first
  },
  {
    id: 'npc-sage-2',
    name: 'Town Sage',
    spriteKey: 'animal_turkey', // Turkey NPC
    dialogText: 'Many patterns exist in code. Let me show you Design Patterns!',
    questId: 'quest-design-patterns',
    questOrder: 8,
    prerequisites: ['quest-state-management', 'quest-async-await'] // Must learn SM and Async first
  },
  {
    id: 'npc-master',
    name: 'Grand Master',
    spriteKey: 'animal_bull', // Bull NPC (special)
    dialogText: 'You\'ve come far. Time to learn Best Practices!',
    questId: 'quest-best-practices',
    questOrder: 9,
    prerequisites: ['quest-design-patterns'] // Must learn Design Patterns first
  }
]

/**
 * LEVEL 3 - CITY MAP
 * 9 NPCs for advanced/expert level concepts
 * Placeholder for future implementation
 */
export const LEVEL_3_NPCS = [
  {
    id: 'npc-city-guide',
    name: 'City Guide',
    spriteKey: 'npc_girl',
    dialogText: 'Welcome to the city! More challenges await!',
    questId: 'quest-advanced-1',
    questOrder: 1,
    prerequisites: ['quest-best-practices'] // From Level 2
  },
  // Additional 8 NPCs for Level 3 - to be expanded later
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `npc-city-${i + 2}`,
    name: `City Expert ${i + 2}`,
    spriteKey: i % 2 === 0 ? 'animal_sheep' : 'animal_rooster',
    dialogText: `Expert ${i + 2}: Advanced concept awaits!`,
    questId: `quest-advanced-${i + 2}`,
    questOrder: i + 2,
    prerequisites: i === 0 ? ['quest-best-practices'] : [`quest-advanced-${i + 1}`]
  }))
]

/**
 * Get NPCs for a specific level
 * @param {number} level - Level number (1, 2, or 3)
 * @returns {Array} Array of NPC data objects for that level
 */
export function getNPCsForLevel(level) {
  switch (level) {
    case 1:
      return LEVEL_1_NPCS
    case 2:
      return LEVEL_2_NPCS
    case 3:
      return LEVEL_3_NPCS
    default:
      console.warn(`Invalid level: ${level}, returning Level 1 NPCs`)
      return LEVEL_1_NPCS
  }
}

/**
 * Get a specific NPC by ID and level
 * @param {string} npcId - NPC ID
 * @param {number} level - Level number
 * @returns {Object|null} NPC data or null if not found
 */
export function getNPCById(npcId, level) {
  const npcs = getNPCsForLevel(level)
  return npcs.find(npc => npc.id === npcId) || null
}

/**
 * Get all NPCs across all levels for bulk operations
 * @returns {Object} Object with level keys containing NPC arrays
 */
export function getAllNPCs() {
  return {
    level1: LEVEL_1_NPCS,
    level2: LEVEL_2_NPCS,
    level3: LEVEL_3_NPCS
  }
}

/**
 * Validate NPC prerequisites against completed quests
 * @param {Object} npc - NPC data object
 * @param {Array} completedQuests - Array of completed quest IDs
 * @returns {boolean} True if all prerequisites are met
 */
export function checkNPCPrerequisites(npc, completedQuests) {
  if (!npc.prerequisites || npc.prerequisites.length === 0) {
    return true // No prerequisites = always available
  }
  return npc.prerequisites.every(questId => completedQuests.includes(questId))
}

export default {
  LEVEL_1_NPCS,
  LEVEL_2_NPCS,
  LEVEL_3_NPCS,
  getNPCsForLevel,
  getNPCById,
  getAllNPCs,
  checkNPCPrerequisites
}
