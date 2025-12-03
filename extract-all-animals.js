import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// All 8 animals
const animals = [
  'Bull_animation_with_shadow.png',
  'Calf_animation_with_shadow.png',
  'Chick_animation_with_shadow.png',
  'Lamb_animation_with_shadow.png',
  'Piglet_animation_with_shadow.png',
  'Rooster_animation_with_shadow.png',
  'Sheep_animation_with_shadow.png',
  'Turkey_animation_with_shadow.png'
]

// Frame size mapping for each animal
const frameConfigs = {
  'Bull_animation_with_shadow.png': { width: 64, height: 64, name: 'Bull' },
  'Calf_animation_with_shadow.png': { width: 64, height: 64, name: 'Calf' },
  'Chick_animation_with_shadow.png': { width: 16, height: 16, name: 'Chick' },
  'Lamb_animation_with_shadow.png': { width: 32, height: 32, name: 'Lamb' },
  'Piglet_animation_with_shadow.png': { width: 32, height: 32, name: 'Piglet' },
  'Rooster_animation_with_shadow.png': { width: 32, height: 32, name: 'Rooster' },
  'Sheep_animation_with_shadow.png': { width: 32, height: 32, name: 'Sheep' },
  'Turkey_animation_with_shadow.png': { width: 32, height: 32, name: 'Turkey' }
}

// Animation ranges
const animations = {
  'walk-down': { start: 0, end: 5, row: 0 },
  'walk-up': { start: 6, end: 11, row: 1 },
  'walk-left': { start: 12, end: 17, row: 2 },
  'walk-right': { start: 18, end: 23, row: 3 },
  'idle-down': { start: 24, end: 27, row: 4 },
  'idle-up': { start: 30, end: 33, row: 5 },
  'idle-left': { start: 36, end: 39, row: 6 },
  'idle-right': { start: 42, end: 45, row: 7 }
}

async function extractFrames(filename) {
  const config = frameConfigs[filename]
  if (!config) {
    console.log(`⚠️  Skipping unknown file: ${filename}`)
    return
  }

  const filePath = path.join(__dirname, 'public', 'assets', 'animals', filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`)
    return
  }

  console.log(`\n🎬 Extracting all animations for: ${config.name}`)
  console.log(`   Frame size: ${config.width}×${config.height}px`)

  const outputDir = path.join(__dirname, 'frame-extracts', 'all-animals', config.name)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const image = sharp(filePath)
  const metadata = await image.metadata()

  console.log(`   Spritesheet: ${metadata.width}×${metadata.height}px`)

  // Extract each animation
  for (const [animName, animConfig] of Object.entries(animations)) {
    console.log(`   📍 ${animName} (frames ${animConfig.start}-${animConfig.end}):`)
    
    for (let frameNum = animConfig.start; frameNum <= animConfig.end; frameNum++) {
      const col = frameNum % 6
      const row = Math.floor(frameNum / 6)
      
      const x = col * config.width
      const y = row * config.height

      const filename = `${config.name.toLowerCase()}-${animName}-frame${frameNum}.png`
      const outputPath = path.join(outputDir, filename)

      try {
        await sharp(filePath)
          .extract({
            left: x,
            top: y,
            width: config.width,
            height: config.height
          })
          .toFile(outputPath)
        
        console.log(`      Frame ${frameNum} ✅`)
      } catch (e) {
        console.log(`      Frame ${frameNum} ❌ - ${e.message}`)
      }
    }
  }

  console.log(`✅ Extracted all frames for ${config.name}`)
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════')
  console.log('🐾 EXTRACTING ALL ANIMATIONS FOR ALL ANIMALS')
  console.log('═══════════════════════════════════════════════════════════════════')

  for (const animal of animals) {
    await extractFrames(animal)
  }

  console.log('\n═══════════════════════════════════════════════════════════════════')
  console.log('✅ EXTRACTION COMPLETE')
  console.log('📁 Output: ./frame-extracts/all-animals/')
  console.log('═══════════════════════════════════════════════════════════════════\n')
}

main().catch(e => console.error('❌ Error:', e))
