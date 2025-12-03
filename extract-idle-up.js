import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const animalsDir = './public/assets/animals';
const outputDir = './frame-extracts';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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

async function extractIdleUpFrames() {
  console.log('🎬 EXTRACTING IDLE-UP ANIMATION FRAMES\n');
  console.log('Idle Up uses frames 28-31\n');

  for (const [name, config] of Object.entries(animals)) {
    const filePath = path.join(animalsDir, config.file);
    const frameW = config.frameWidth;
    const frameH = config.frameHeight;
    const cols = 6;

    try {
      console.log(`📍 ${name.toUpperCase()}`);

      // Frames 28-31
      const frames = [
        { num: 28, col: 4, row: 4 },
        { num: 29, col: 5, row: 4 },
        { num: 30, col: 0, row: 5 },
        { num: 31, col: 1, row: 5 }
      ];

      for (const frame of frames) {
        const left = frame.col * frameW;
        const top = frame.row * frameH;
        
        const outputPath = path.join(outputDir, `${name}-idle-up-frame${frame.num}.png`);
        
        await sharp(filePath)
          .extract({
            left,
            top,
            width: frameW,
            height: frameH
          })
          .toFile(outputPath);

        console.log(`   ✅ Frame ${frame.num} (col ${frame.col}, row ${frame.row}) → ${outputPath}`);
      }

      console.log();

    } catch (error) {
      console.error(`❌ Error extracting ${name}:`, error.message);
    }
  }

  console.log('✅ All idle-up frames extracted. Check them visually for missing/blank frames.');
}

extractIdleUpFrames();
