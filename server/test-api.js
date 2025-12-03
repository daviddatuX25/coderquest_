#!/usr/bin/env node

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';

class APIClient {
  static async createPlayer(username) {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  static async getPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  static async updateProgress(playerId, progressData) {
    const response = await fetch(`${API_URL}/players/${playerId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  static async getLeaderboard(limit = 100, offset = 0) {
    const response = await fetch(`${API_URL}/leaderboard?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  static async getTopPlayers(count = 10) {
    const response = await fetch(`${API_URL}/leaderboard/top/${count}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  static async getPlayerRank(playerId) {
    const response = await fetch(`${API_URL}/leaderboard/rank/${playerId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }
}

async function runTests() {
  console.log('🧪 Starting CoderQuest API Tests...\n');

  try {
    // Test 1: Create Player
    console.log('✓ Test 1: Creating a new player...');
    const player = await APIClient.createPlayer('TestPlayer_' + Date.now());
    console.log(`  Player created: ${player.username} (ID: ${player.playerId})\n`);
    const playerId = player.playerId;

    // Test 2: Get Player
    console.log('✓ Test 2: Fetching player data...');
    const fetchedPlayer = await APIClient.getPlayer(playerId);
    console.log(`  Player: ${fetchedPlayer.username}, Level: ${fetchedPlayer.current_level}\n`);

    // Test 3: Update Progress
    console.log('✓ Test 3: Updating player progress...');
    await APIClient.updateProgress(playerId, {
      current_level: 2,
      experience: 1500,
      completed_quests: ['quest_1', 'quest_2'],
      completed_levels: ['level_1'],
      total_score: 5000,
      play_time: 3600
    });
    console.log(`  Progress updated successfully\n`);

    // Test 4: Get Updated Player
    console.log('✓ Test 4: Verifying updated progress...');
    const updatedPlayer = await APIClient.getPlayer(playerId);
    console.log(`  Level: ${updatedPlayer.current_level}, Score: ${updatedPlayer.total_score}\n`);

    // Test 5: Create more players for leaderboard
    console.log('✓ Test 5: Creating additional players for leaderboard...');
    for (let i = 0; i < 5; i++) {
      const p = await APIClient.createPlayer(`Player_${i + 1}_${Date.now()}`);
      await APIClient.updateProgress(p.playerId, {
        total_score: Math.floor(Math.random() * 10000),
        current_level: Math.floor(Math.random() * 5) + 1,
        play_time: Math.floor(Math.random() * 7200)
      });
    }
    console.log(`  Created 5 additional players\n`);

    // Test 6: Get Leaderboard
    console.log('✓ Test 6: Fetching leaderboard...');
    const leaderboard = await APIClient.getLeaderboard(10, 0);
    console.log(`  Total players: ${leaderboard.total}`);
    console.log(`  Top 5 players:`);
    leaderboard.players.slice(0, 5).forEach(p => {
      console.log(`    ${p.rank}. ${p.username} - Score: ${p.total_score}`);
    });
    console.log();

    // Test 7: Get Top Players
    console.log('✓ Test 7: Fetching top 5 players...');
    const topPlayers = await APIClient.getTopPlayers(5);
    console.log(`  Found ${topPlayers.players.length} top players\n`);

    // Test 8: Get Player Rank
    console.log('✓ Test 8: Getting player rank...');
    const ranking = await APIClient.getPlayerRank(playerId);
    console.log(`  Player rank: ${ranking.rank} of ${ranking.total_players}\n`);

    console.log('✅ All tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
