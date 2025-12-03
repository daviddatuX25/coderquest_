import sharp from 'sharp';
import path from 'path';

const animalsDir = './public/assets/animals';

async function inspectSprites() {
  console.log('🔍 Inspecting animal sprite dimensions...\n');
  
  const animals = [
    'Bull',
    'Calf',
    'Chick',
    'Lamb',
    'Piglet',
    'Rooster',
    'Sheep',
    'Turkey'
  ];
  
  for (const animal of animals) {
    const filePath = path.join(animalsDir, `${animal}_animation_with_shadow.png`);
    
    try {
      const metadata = await sharp(filePath).metadata();
      const width = metadata.width;
      const height = metadata.height;
      
      console.log(`📄 ${animal}_animation_with_shadow.png`);
      console.log(`   Total size: ${width}×${height}px`);
      
      // Try different grid configurations
      console.log(`   Possible grids:`);
      console.log(`   - 6 cols × 8 rows: ${(width/6).toFixed(1)}×${(height/8).toFixed(1)}px per frame (exact: ${width%6===0 ? '✅' : '❌'})`);
      console.log(`   - 8 cols × 6 rows: ${(width/8).toFixed(1)}×${(height/6).toFixed(1)}px per frame (exact: ${width%8===0 ? '✅' : '❌'})`);
      console.log(`   - 12 cols × 4 rows: ${(width/12).toFixed(1)}×${(height/4).toFixed(1)}px per frame (exact: ${width%12===0 ? '✅' : '❌'})`);
      console.log();
    } catch (error) {
      console.error(`❌ Failed to read ${animal}:`, error.message);
    }
  }
}

inspectSprites();
