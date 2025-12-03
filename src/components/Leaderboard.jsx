/**
 * Leaderboard.jsx - Displays top players and current player rank
 */

import React, { useEffect, useState } from 'react';
import { PlayerProgressManager } from '../utils/PlayerProgressManager';
import '../styles/leaderboard.scss';

export function Leaderboard({ isOpen, onClose }) {
  const [players, setPlayers] = useState([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLeaderboard() {
      setLoading(true);
      setError(null);

      try {
        // Get top 20 players
        const topPlayers = await PlayerProgressManager.getTopPlayers(20);
        setPlayers(topPlayers.players || []);

        // Get current player rank
        const playerId = localStorage.getItem('playerId');
        if (playerId) {
          const ranking = await PlayerProgressManager.prototype.getPlayerRank.call(
            { playerId },
            playerId
          );
          setCurrentPlayerRank(ranking);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();

    // Refresh every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="loading">Loading leaderboard...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {currentPlayerRank && (
              <div className="current-player-info">
                <div className="player-rank">
                  <span className="rank-number">#{currentPlayerRank.rank}</span>
                  <span className="player-name">You</span>
                  <span className="score">{currentPlayerRank.player.total_score.toLocaleString()}</span>
                </div>
                <div className="rank-info">
                  Rank {currentPlayerRank.rank} of {currentPlayerRank.total_players}
                </div>
              </div>
            )}

            <div className="leaderboard-table">
              <div className="table-header">
                <div className="col-rank">Rank</div>
                <div className="col-player">Player</div>
                <div className="col-score">Score</div>
                <div className="col-level">Level</div>
                <div className="col-time">Play Time</div>
              </div>

              <div className="table-body">
                {players.length === 0 ? (
                  <div className="empty-message">No players yet</div>
                ) : (
                  players.map((player, index) => (
                    <div key={player.id} className={`table-row ${index === 0 ? 'first-place' : ''}`}>
                      <div className="col-rank">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${player.rank}`}
                      </div>
                      <div className="col-player">{player.username}</div>
                      <div className="col-score">{player.total_score.toLocaleString()}</div>
                      <div className="col-level">Lvl {player.current_level}</div>
                      <div className="col-time">
                        {Math.floor(player.play_time / 3600)}h {Math.floor((player.play_time % 3600) / 60)}m
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
