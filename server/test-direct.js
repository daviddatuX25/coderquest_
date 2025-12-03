#!/usr/bin/env node

/**
 * Direct database test - bypasses network
 */

import db from './db/database.js';
import { Player } from './models/Player.js';

async function directTest() {
  console.log('🧪 Running Direct Database Tests...\n');

  try {
    // Test 1: Create player
    console.log('✓ Test 1: Creating player directly...');
    const player = await Player.createPlayer('DirectTestPlayer_' + Date.now());
    console.log(`  Created: ${player.username} (ID: ${player.playerId})\n`);

    // Test 2: Get player
    console.log('✓ Test 2: Retrieving player...');
    const fetched = await Player.getPlayer(player.playerId);
    console.log(`  Retrieved: ${fetched.username}\n`);

    // Test 3: Update progress
    console.log('✓ Test 3: Updating progress...');
    await Player.updateProgress(player.playerId, {
      current_level: 2,
      experience: 1500,
      completed_quests: ['q1', 'q2'],
      completed_levels: ['l1'],
      total_score: 5000,
      play_time: 3600
    });
    console.log('  Progress updated\n');

    // Test 4: Verify update
    console.log('✓ Test 4: Verifying update...');
    const updated = await Player.getPlayer(player.playerId);
    console.log(`  Score: ${updated.total_score}, Level: ${updated.current_level}\n`);

    // Test 5: Create more players
    console.log('✓ Test 5: Creating 3 more players...');
    for (let i = 0; i < 3; i++) {
      const p = await Player.createPlayer(`TestPlayer${i}_${Date.now()}`);
      await Player.updateProgress(p.playerId, {
        total_score: Math.floor(Math.random() * 10000),
        current_level: Math.floor(Math.random() * 5) + 1,
        play_time: Math.floor(Math.random() * 7200)
      });
    }
    console.log('  Created 3 additional players\n');

    // Test 6: Get all players
    console.log('✓ Test 6: Getting all players...');
    const all = await Player.getAllPlayers();
    console.log(`  Total players: ${all.length}`);
    console.log('  Top 3:');
    all.slice(0, 3).forEach((p, i) => {
      console.log(`    ${i + 1}. ${p.username} - Score: ${p.total_score}`);
    });

    console.log('\n✅ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

directTest();
