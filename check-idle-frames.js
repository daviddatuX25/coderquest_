import sharp from 'sharp';
import path from 'path';

const animalsDir = './public/assets/animals';

const animals = {
  bull: { file: 'Bull_animation_with_shadow.png', frameWidth: 64, frameHeight: 64 },
  calf: { file: 'Calf_animation_with_shadow.png', frameWidth: 64, frameHeight: 64 },
  lamb: { file: 'Lamb_animation_with_shadow.png', frameWidth: 32, frameHeight: 32 },
  piglet: { file: 'Piglet_animation_with_shadow.png', frameWidth: 32, frameHeight: 32 },
  rooster: { file: 'Rooster_animation_with_shadow.png', frameWidth: 32, frameHeight: 32 },
  sheep: { file: 'Sheep_animation_with_shadow.png', frameWidth: 32, frameHeight: 32 },
  turkey: { file: 'Turkey_animation_with_shadow.png', frameWidth: 32, frameHeight: 32 },
  chick: { file: 'Chick_animation_with_shadow.png', frameWidth: 16, frameHeight: 16 }
};

function getFramePosition(frameNum, cols, frameW, frameH) {
  const col = frameNum % cols;
  const row = Math.floor(frameNum / cols);
  return {
    frameNum,
    col,
    row,
    x: col * frameW,
    y: row * frameH
  };
}

async function analyzeIdleFrames() {
  console.log('🎬 ANALYZING IDLE ANIMATION FRAMES\n');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const idleAnimations = [
    { name: 'Idle Down', frames: [24, 25, 26, 27] },
    { name: 'Idle Up', frames: [28, 29, 30, 31] },
    { name: 'Idle Left', frames: [32, 33, 34, 35] },
    { name: 'Idle Right', frames: [36, 37, 38, 39] }
  ];

  for (const [animalName, config] of Object.entries(animals)) {
    const filePath = path.join(animalsDir, config.file);
    
    try {
      const metadata = await sharp(filePath).metadata();
      const cols = 6;
      const totalFrames = (metadata.width / config.frameWidth) * (metadata.height / config.frameHeight);
      
      console.log(`📋 ${animalName.toUpperCase()} (${metadata.width}×${metadata.height}px, ${config.frameWidth}×${config.frameHeight}px frames)`);
      console.log(`   Total frames available: ${totalFrames}\n`);

      for (const anim of idleAnimations) {
        console.log(`   ${anim.name}:`);
        
        let allValid = true;
        for (const frameNum of anim.frames) {
          const pos = getFramePosition(frameNum, cols, config.frameWidth, config.frameHeight);
          const isValid = frameNum < totalFrames;
          const status = isValid ? '✅' : '❌ OUT OF BOUNDS';
          
          if (!isValid) allValid = false;
          
          console.log(`      Frame ${frameNum} → Col ${pos.col}, Row ${pos.row} (pos: ${pos.x}, ${pos.y}) ${status}`);
        }
        
        console.log(`   ${allValid ? '✅ ALL FRAMES VALID' : '⚠️ SOME FRAMES INVALID'}\n`);
      }
      
      console.log();

    } catch (error) {
      console.error(`❌ Error analyzing ${animalName}:`, error.message);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════════\n');
  console.log('NOTES:');
  console.log('- Idle animations use frames 24-39 (16 frames total)');
  console.log('- Each idle direction: 4 frames');
  console.log('- If frames are out of bounds, they will cause blank/blinking frames');
  console.log('- All animals should have 48 frames (0-47) in a 6×8 grid\n');
}

analyzeIdleFrames();
