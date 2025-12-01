# NPC System - Random Movement & Animation Guide

## Overview
NPCs now have sprite-based animation, physics bodies, and autonomous random movement within designated patrol areas.

## NPC Configuration

Each NPC is created with the following properties:

```javascript
{
  id: 'npc-mentor',           // Unique identifier
  name: 'Mentor',             // Display name (shown above sprite)
  dialogText: 'Hello...',     // Text shown on interaction
  questId: 'quest-intro',     // Associated quest
  questData: {...},           // Quest metadata
  patrolRadius: 80,           // How far to wander from spawn (pixels)
  moveSpeed: 60,              // Movement speed (pixels/second)
  interactionDistance: 100    // Range at which player can interact
}
```

## Sprite Details

**Asset**: `npc1.png` (9-frame strip)
- **Frame Size**: 16x21 pixels
- **Rendered Size**: 32x42 pixels (scaled 2x)
- **Hitbox**: 10x5 at offset (3, 16) - feet only

**Frame Layout**:
- Frame 0: Idle Down
- Frame 1: Idle Up
- Frame 2: Idle Side (flipped for left/right)
- Frame 3: Walk Down (step 1)
- Frame 4: Walk Down (step 2)
- Frame 5: Walk Up (step 1)
- Frame 6: Walk Up (step 2)
- Frame 7: Walk Side (step 1)
- Frame 8: Walk Side (step 2)

## Animations

The NPC system automatically creates animations for:

1. **Idle Animations** (static frame with direction)
   - `idle-down`: Frame 0
   - `idle-up`: Frame 1
   - `idle-side`: Frame 2

2. **Walk Animations** (4-frame loop)
   - `walk-down`: [0, 3, 0, 4]
   - `walk-up`: [1, 5, 1, 6]
   - `walk-side`: [2, 7, 2, 8]

## Movement Behavior

NPCs perform **random patrol movement**:

1. **Schedule**: Every 2-4 seconds, NPCs decide their next action
2. **Action Distribution**:
   - 70% chance to walk to a random location within `patrolRadius`
   - 30% chance to idle and look around (random direction)

3. **Movement**:
   - Randomly picks angle and distance within patrol radius
   - Moves smoothly towards target at `moveSpeed`
   - Automatically stops when reaching target
   - Velocity is set to 0 when idle

4. **Direction Detection**: Automatically determines direction based on movement vector:
   - More vertical movement → "up" or "down"
   - More horizontal movement → "side" (flipped randomly)

## Physics

- **Body Type**: Immovable (NPCs don't get knocked around)
- **Size**: 10x5 pixels at feet (using "feet rule" like player)
- **Collision**: Can collide with world bounds and other objects
- **Interaction**: Detects when player is within `interactionDistance`

## Code Example

### Creating an NPC with Movement

```javascript
npcSystem.createNPC(400, 300, 'npc_girl', {
  id: 'npc-mentor',
  name: 'Mentor',
  dialogText: 'Welcome to CoderQuest!',
  patrolRadius: 100,  // Wander up to 100px from spawn
  moveSpeed: 80,      // Move at 80 pixels/second
  interactionDistance: 100
})
```

### Controlling an NPC Manually

```javascript
const npc = npcSystem.getNPC('npc-mentor')

// Make NPC walk to a specific location
npc.moveTo(500, 250, 'down')

// Make NPC stop and idle
npc.stopMovement()

// Make NPC look in a direction
npc.lookDirection('up')

// Stop random movement (NPC becomes static)
if (npc.moveTimer) npc.moveTimer.remove()
```

## Performance Notes

- Each NPC has its own animation set (keys are namespaced with sprite key)
- Animations are created once and reused
- Movement updates only when moving (not continuously calculating)
- Timer events use Phaser's built-in system (no custom loops)

## Customization

### Change Movement Pattern

Edit `NPCSystem.js` in the `scheduleRandomMovement()` method:

```javascript
// Change move frequency (currently 2-4 seconds)
delay: Phaser.Math.Between(3000, 5000)  // 3-5 seconds instead

// Change idle vs walk ratio (currently 70% walk, 30% idle)
if (Math.random() < 0.8) {  // 80% walk, 20% idle
  this.randomWalk()
} else {
  this.randomIdle()
}
```

### Change Patrol Area

Modify the `patrolRadius` in NPC data:

```javascript
patrolRadius: 150  // Wander up to 150px from spawn
```

### Add NPCs with Different Sprites

1. Load additional spritesheet in `BootScene.js`:
   ```javascript
   this.load.spritesheet('npc_boy', 'assets/characters/npc2.png', { 
     frameWidth: 16, 
     frameHeight: 21 
   })
   ```

2. Create NPC with different key:
   ```javascript
   npcSystem.createNPC(x, y, 'npc_boy', {...})
   ```

3. Update `NPCSystem.createNPC()` to handle multiple sprite types

## Integration with Rest of Game

- **Collision**: NPCs collide with world bounds and collision objects (same as player)
- **Interaction**: Player presses E when in range, NPC stops moving and returns dialog
- **Depth**: NPCs render above all static tiles (uses scene.npcDepth)
- **Updates**: NPCs update every frame in MainScene update loop

---

**Next Steps**: 
- Add more NPC sprites and variety
- Create behavior trees for different NPC types
- Add dialogue trees instead of single interaction
- Implement quest progression affecting NPC behavior
