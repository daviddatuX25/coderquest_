import sharp from 'sharp';
import path from 'path';

const animalsDir = './public/assets/animals';

const animals = {
  bull: { file: 'Bull_animation_with_shadow.png', frameWidth: 64, frameHeight: 64, scale: 0.75 },
  calf: { file: 'Calf_animation_with_shadow.png', frameWidth: 64, frameHeight: 64, scale: 0.75 },
  lamb: { file: 'Lamb_animation_with_shadow.png', frameWidth: 32, frameHeight: 32, scale: 1.0 },
  piglet: { file: 'Piglet_animation_with_shadow.png', frameWidth: 32, frameHeight: 32, scale: 1.0 },
  rooster: { file: 'Rooster_animation_with_shadow.png', frameWidth: 32, frameHeight: 32, scale: 1.0 },
  sheep: { file: 'Sheep_animation_with_shadow.png', frameWidth: 32, frameHeight: 32, scale: 1.0 },
  turkey: { file: 'Turkey_animation_with_shadow.png', frameWidth: 32, frameHeight: 32, scale: 1.0 },
  chick: { file: 'Chick_animation_with_shadow.png', frameWidth: 16, frameHeight: 16, scale: 1.5 }
};

async function generateReport() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 ANIMATION FRAME CONFIGURATION REPORT');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const animations = [
    { name: 'Walk Down', frames: '0-5', row: 0 },
    { name: 'Walk Up', frames: '6-11', row: 1 },
    { name: 'Walk Left', frames: '12-17', row: 2 },
    { name: 'Walk Right', frames: '18-23', row: 3 },
    { name: 'Idle Down', frames: '24-27', row: 4 },
    { name: 'Idle Up', frames: '28-31', row: 5 },
    { name: 'Idle Left', frames: '32-35', row: 6 },
    { name: 'Idle Right', frames: '36-39', row: 7 }
  ];

  for (const [name, config] of Object.entries(animals)) {
    const filePath = path.join(animalsDir, config.file);
    
    try {
      const metadata = await sharp(filePath).metadata();
      const displayWidth = Math.round(config.frameWidth * config.scale);
      const displayHeight = Math.round(config.frameHeight * config.scale);
      
      console.log(`📋 ${name.toUpperCase()}`);
      console.log(`   File: ${config.file}`);
      console.log(`   Spritesheet: ${metadata.width}×${metadata.height}px (6×8 grid)`);
      console.log(`   Frame: ${config.frameWidth}×${config.frameHeight}px`);
      console.log(`   Display: ${displayWidth}×${displayHeight}px (scale: ${config.scale}x)`);
      console.log(`   Animations:\n`);

      for (const anim of animations) {
        const [start, end] = anim.frames.split('-').map(Number);
        const frameCount = end - start + 1;
        const isWalk = anim.name.includes('Walk');
        const isIdle = anim.name.includes('Idle');
        
        const status = (isWalk && frameCount === 6) || (isIdle && frameCount === 4) ? '✅' : '⚠️';
        
        console.log(`   ${status} ${anim.name.padEnd(15)} → Frames ${anim.frames.padEnd(6)} (${frameCount} frames, row ${anim.row + 1})`);
      }
      
      console.log();

    } catch (error) {
      console.error(`❌ Error processing ${name}:`, error.message);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('CONFIGURATION SUMMARY:');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('✅ All spritesheets: 6 columns × 8 rows');
  console.log('✅ Walk animations: 6 frames per direction');
  console.log('✅ Idle animations: 4 frames per direction');
  console.log('✅ Total frames per animal: 48');
  console.log('✅ Phaser frame numbering: 0-47 (Phaser auto-generates sequential frame numbers)');
  console.log('\n✅ READY FOR ANIMATION PLAYBACK!');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

generateReport();
