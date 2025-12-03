import React, { useState, useEffect } from 'react';
import { getProgress } from '../data/progressManager';

/**
 * StatsPanel Component
 * Displays player statistics including quest scores and completion rates
 */
function StatsPanel() {
  const [stats, setStats] = useState({
    totalQuests: 0,
    completedQuests: 0,
    averageScore: 0,
    questDetails: []
  });

  useEffect(() => {
    const progress = getProgress();
    
    // Calculate stats
    const completedCount = Object.keys(progress.completedQuests).length;
    const totalCompleted = Object.keys(progress.questScores).length;
    
    let totalScore = 0;
    const questDetails = [];
    
    for (const [questId, score] of Object.entries(progress.questScores)) {
      totalScore += score;
      questDetails.push({
        id: questId,
        score: score,
        isCompleted: !!progress.completedQuests[questId]
      });
    }
    
    const averageScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;
    
    setStats({
      totalQuests: totalCompleted,
      completedQuests: completedCount,
      averageScore,
      questDetails
    });
  }, []);

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>📊 Your Progress</h3>
      </div>

      <div className="stats-summary">
        <div className="stat-box">
          <div className="stat-label">Total Quests</div>
          <div className="stat-value">{stats.totalQuests}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats.completedQuests}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{stats.averageScore}%</div>
        </div>
      </div>

      {stats.questDetails.length > 0 && (
        <div className="stats-detail">
          <h4>Quest Scores:</h4>
          <div className="quest-scores">
            {stats.questDetails.map((quest, idx) => (
              <div key={idx} className="quest-score-item">
                <span className="quest-name">
                  {quest.isCompleted ? '✅' : '⏳'} {quest.id}
                </span>
                <span className="quest-score">{quest.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalQuests === 0 && (
        <div className="stats-empty">
          <p>No quests completed yet. Start your journey!</p>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
