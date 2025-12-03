#!/usr/bin/env node

/**
 * Complete End-to-End Test
 * Tests: Player creation, progress saving, and leaderboard
 */

import fetch from 'node-fetch';

const API_URL = 'http://127.0.0.1:3001/api';
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    process.stdout.write(`⏳ ${name}... `);
    await fn();
    console.log('✅');
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${error.message}`);
    testsFailed++;
  }
}

async function run() {
  console.log('\n🧪 CoderQuest End-to-End Tests\n');

  let player1Id, player2Id, player3Id;

  // Test 1: Create first player
  await test('Create Player 1', async () => {
    const res = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `Player1_${Date.now()}` })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    player1Id = data.playerId;
    if (!player1Id) throw new Error('No playerId returned');
  });

  // Test 2: Create second player
  await test('Create Player 2', async () => {
    const res = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `Player2_${Date.now()}` })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    player2Id = data.playerId;
  });

  // Test 3: Create third player
  await test('Create Player 3', async () => {
    const res = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `Player3_${Date.now()}` })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    player3Id = data.playerId;
  });

  // Test 4: Get player 1
  await test('Get Player 1 data', async () => {
    const res = await fetch(`${API_URL}/players/${player1Id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.username) throw new Error('No username in response');
  });

  // Test 5: Update player 1 progress
  await test('Update Player 1 progress', async () => {
    const res = await fetch(`${API_URL}/players/${player1Id}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_level: 3,
        experience: 2500,
        total_score: 8750,
        completed_levels: ['level1', 'level2'],
        completed_quests: ['quest1', 'quest2', 'quest3'],
        play_time: 7200
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Update not successful');
  });

  // Test 6: Update player 2 progress
  await test('Update Player 2 progress', async () => {
    const res = await fetch(`${API_URL}/players/${player2Id}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_level: 2,
        experience: 1800,
        total_score: 6500,
        completed_levels: ['level1'],
        completed_quests: ['quest1', 'quest2'],
        play_time: 5400
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // Test 7: Update player 3 progress
  await test('Update Player 3 progress', async () => {
    const res = await fetch(`${API_URL}/players/${player3Id}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_level: 4,
        experience: 3200,
        total_score: 10000,
        completed_levels: ['level1', 'level2', 'level3'],
        completed_quests: ['quest1', 'quest2', 'quest3', 'quest4'],
        play_time: 9600
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // Test 8: Get leaderboard
  await test('Get leaderboard (top 10)', async () => {
    const res = await fetch(`${API_URL}/leaderboard?limit=10&offset=0`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.players)) throw new Error('Players not an array');
    if (data.players.length < 3) throw new Error('Less than 3 players in leaderboard');
  });

  // Test 9: Get top 3 players
  await test('Get top 3 players', async () => {
    const res = await fetch(`${API_URL}/leaderboard/top/3`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.players)) throw new Error('Players not an array');
    if (data.players.length !== 3) throw new Error(`Expected 3 players, got ${data.players.length}`);
  });

  // Test 10: Get player 1 rank
  await test('Get Player 1 rank', async () => {
    const res = await fetch(`${API_URL}/leaderboard/rank/${player1Id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.rank !== 'number') throw new Error('No rank returned');
    if (data.rank < 1) throw new Error('Invalid rank');
  });

  // Test 11: Verify leaderboard sorting
  await test('Verify leaderboard sorted by score', async () => {
    const res = await fetch(`${API_URL}/leaderboard?limit=10&offset=0`);
    const data = await res.json();
    const top3 = data.players.slice(0, 3);
    
    // Check descending order
    for (let i = 1; i < top3.length; i++) {
      if (top3[i].total_score > top3[i - 1].total_score) {
        throw new Error('Leaderboard not sorted correctly');
      }
    }
  });

  // Test 12: Get player by username
  await test('Get player by username', async () => {
    // First get the username
    const getRes = await fetch(`${API_URL}/players/${player1Id}`);
    const playerData = await getRes.json();
    
    // Then fetch by username
    const res = await fetch(`${API_URL}/players/username/${playerData.username}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.id !== player1Id) throw new Error('Wrong player returned');
  });

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`${'='.repeat(50)}\n`);

  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Game is ready to play!\n');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Check errors above.\n');
    process.exit(1);
  }
}

run();
