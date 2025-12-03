import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const animalsDir = './public/assets/animals';
const outputDir = './frame-extracts/full-animations';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Extract ALL frames from one animal for full inspection
const targetAnimal = 'lamb'; // Change this to inspect different animals
const config = {
  file: 'Lamb_animation_with_shadow.png',
  frameWidth: 32,
  frameHeight: 32
};

const animations = [
  { name: 'Walk Down', frames: [0, 1, 2, 3, 4, 5] },
  { name: 'Walk Up', frames: [6, 7, 8, 9, 10, 11] },
  { name: 'Walk Left', frames: [12, 13, 14, 15, 16, 17] },
  { name: 'Walk Right', frames: [18, 19, 20, 21, 22, 23] },
  { name: 'Idle Down', frames: [24, 25, 26, 27] },
  { name: 'Idle Up', frames: [28, 29, 30, 31] },
  { name: 'Idle Left', frames: [32, 33, 34, 35] },
  { name: 'Idle Right', frames: [36, 37, 38, 39] }
];

async function extractAllFrames() {
  console.log(`🎬 EXTRACTING ALL ANIMATION FRAMES FOR: ${targetAnimal.toUpperCase()}\n`);
  console.log(`File: ${config.file}`);
  console.log(`Frame size: ${config.frameWidth}×${config.frameHeight}px`);
  console.log(`Total animations: ${animations.length}\n`);

  const filePath = path.join(animalsDir, config.file);

  try {
    // Create a grid image for each animation
    for (const anim of animations) {
      console.log(`📍 ${anim.name}:`);
      
      const cols = 6;
      const frameW = config.frameWidth;
      const frameH = config.frameHeight;

      for (const frameNum of anim.frames) {
        const col = frameNum % cols;
        const row = Math.floor(frameNum / cols);
        const left = col * frameW;
        const top = row * frameH;

        const outputPath = path.join(
          outputDir,
          `${targetAnimal}-${anim.name.replace(/ /g, '-').toLowerCase()}-frame${frameNum.toString().padStart(2, '0')}.png`
        );

        await sharp(filePath)
          .extract({
            left,
            top,
            width: frameW,
            height: frameH
          })
          .toFile(outputPath);

        console.log(`   Frame ${frameNum.toString().padStart(2, '0')} (col ${col}, row ${row}) ✅`);
      }
      
      console.log();
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`✅ ALL FRAMES EXTRACTED TO: ${outputDir}/`);
    console.log(`📸 Total frames: ${animations.reduce((sum, a) => sum + a.frames.length, 0)}`);
    console.log('\n🔍 NEXT STEPS:');
    console.log('1. Open the frame-extracts/full-animations folder');
    console.log('2. Look for any blank/missing frames');
    console.log('3. Identify which animations have issues');
    console.log('4. Report back which frame numbers are blank');
    console.log('═══════════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

extractAllFrames();
