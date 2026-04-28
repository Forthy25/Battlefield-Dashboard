"use strict";

function calculateStats(matches) {
  const totalMatches = matches.length;
  const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
  const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
  const totalScore = matches.reduce((sum, match) => sum + match.score, 0);
  const totalWins = matches.filter((match) => match.win).length;

  const kdRatio = totalDeaths ? (totalKills / totalDeaths).toFixed(2) : "N/A";
  const winRate = totalMatches
    ? ((totalWins / totalMatches) * 100).toFixed(2)
    : "N/A";
  const averageScore = totalMatches
    ? (totalScore / totalMatches).toFixed(0)
    : "N/A";

  return {
    totalMatches,
    totalKills,
    totalDeaths,
    totalScore,
    totalWins,
    kdRatio,
    winRate,
    averageScore,
  };
}

function topMapsKD(matches, topN = 3) {
  const mapStats = {};

  matches.forEach((match) => {
    // Initialize map if not present, otherwise add values
    if (!mapStats[match.map])
      mapStats[match.map] = { kills: 0, deaths: 0, matchCount: 0 };
    mapStats[match.map].kills += match.kills;
    mapStats[match.map].deaths += match.deaths;
    mapStats[match.map].matchCount += 1;
  });

  return (
    Object.entries(mapStats)
      .map(([map, stats]) => ({
        map,
        kdRatio: stats.deaths ? (stats.kills / stats.deaths).toFixed(2) : "N/A",
        matchCount: stats.matchCount,
      }))
      // Keep only maps with at least 3 matches
      .filter((mapData) => mapData.matchCount >= 3)
      .sort((a, b) => parseFloat(b.kdRatio) - parseFloat(a.kdRatio))
      .slice(0, topN)
  );
}

function graphKD(matches, cap = 25) {
  return matches.map((match) => {
    const kdRatio = (match.kills / Math.max(match.deaths, 1)).toFixed(2); // Avoid division by zero
    return Math.min(kdRatio, cap); // Cap at 25
  });
}

export { calculateStats };
export { topMapsKD };
export { graphKD };
