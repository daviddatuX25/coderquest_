import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const animalsDir = './public/assets/animals';
const outputDir = './frame-extracts';

// Ensure output directory exists
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

async function extractFrames() {
  console.log('🎬 Extracting animation frames for verification...\n');

  for (const [name, config] of Object.entries(animals)) {
    const filePath = path.join(animalsDir, config.file);
    const frameW = config.frameWidth;
    const frameH = config.frameHeight;
    const cols = 6;

    try {
      console.log(`📍 Processing ${name.toUpperCase()}...`);

      // Extract Walk Down (frames 0-5)
      const walkDownFrames = [];
      for (let i = 0; i < 6; i++) {
        const col = i % cols;
        const row = 0; // row 1
        const left = col * frameW;
        const top = row * frameH;
        
        walkDownFrames.push({
          left,
          top,
          width: frameW,
          height: frameH
        });
      }

      // Extract first walk down frame for visual check
      const firstFrame = walkDownFrames[0];
      const outputPath = path.join(outputDir, `${name}-walk-down-frame0.png`);
      
      await sharp(filePath)
        .extract({
          left: firstFrame.left,
          top: firstFrame.top,
          width: firstFrame.width,
          height: firstFrame.height
        })
        .toFile(outputPath);

      console.log(`   ✅ Extracted Walk Down frame 0 to ${outputPath}`);

      // Extract an Idle Down frame (frames 24-27, should be row 5)
      const idleDownFrame = {
        left: 0, // first frame of idle animation
        top: 4 * frameH, // row 5 (0-indexed)
        width: frameW,
        height: frameH
      };

      const idleOutputPath = path.join(outputDir, `${name}-idle-down-frame0.png`);
      await sharp(filePath)
        .extract({
          left: idleDownFrame.left,
          top: idleDownFrame.top,
          width: idleDownFrame.width,
          height: idleDownFrame.height
        })
        .toFile(idleOutputPath);

      console.log(`   ✅ Extracted Idle Down frame 0 to ${idleOutputPath}`);

    } catch (error) {
      console.error(`❌ Failed to process ${name}:`, error.message);
    }
  }

  console.log(`\n✅ Frame extracts saved to ${outputDir}/`);
  console.log('📸 Check these files to visually verify frame extraction is working correctly');
}

extractFrames();
