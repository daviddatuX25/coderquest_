import sharp from 'sharp';
import path from 'path';

const animalsDir = './public/assets/animals';

// Animation frame layout: 6 columns × 8 rows
// Row 1: Walk Down (frames 0-5)
// Row 2: Walk Up (frames 6-11)
// Row 3: Walk Left (frames 12-17)
// Row 4: Walk Right (frames 18-23)
// Row 5: Idle Down (frames 24-27)
// Row 6: Idle Up (frames 28-31)
// Row 7: Idle Left (frames 32-35)
// Row 8: Idle Right (frames 36-39)

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

async function analyzeAnimations() {
  console.log('🎬 Analyzing animal animation frames...\n');

  for (const [name, config] of Object.entries(animals)) {
    const filePath = path.join(animalsDir, config.file);
    
    try {
      const metadata = await sharp(filePath).metadata();
      const width = metadata.width;
      const height = metadata.height;
      const cols = 6;
      const rows = 8;
      const frameW = config.frameWidth;
      const frameH = config.frameHeight;
      
      console.log(`📄 ${name.toUpperCase()} (${config.file})`);
      console.log(`   Spritesheet: ${width}×${height}px`);
      console.log(`   Frame size: ${frameW}×${frameH}px`);
      console.log(`   Grid: ${cols}×${rows} = ${cols * rows} total frames`);
      console.log(`   Expected size: ${frameW * cols}×${frameH * rows}px`);
      console.log(`   Match: ${width === frameW * cols && height === frameH * rows ? '✅ PERFECT' : '❌ MISMATCH'}`);
      
      // Calculate frame positions
      const animations = {
        'Walk Down': { start: 0, end: 5, row: 1 },
        'Walk Up': { start: 6, end: 11, row: 2 },
        'Walk Left': { start: 12, end: 17, row: 3 },
        'Walk Right': { start: 18, end: 23, row: 4 },
        'Idle Down': { start: 24, end: 27, row: 5 },
        'Idle Up': { start: 28, end: 31, row: 6 },
        'Idle Left': { start: 32, end: 35, row: 7 },
        'Idle Right': { start: 36, end: 39, row: 8 }
      };
      
      console.log(`   Animations:`);
      for (const [anim, info] of Object.entries(animations)) {
        const startCol = info.start % cols;
        const endCol = info.end % cols;
        const row = Math.floor(info.start / cols);
        
        const startX = startCol * frameW;
        const startY = row * frameH;
        const endX = (info.end % cols) * frameW;
        
        console.log(`   - ${anim}: frames ${info.start}-${info.end} (row ${row + 1})`);
        console.log(`     Position: (${startX}, ${startY}) to (${endX}, ${startY + frameH})`);
      }
      
      console.log();
    } catch (error) {
      console.error(`❌ Failed to analyze ${name}:`, error.message);
    }
  }
}

analyzeAnimations();
