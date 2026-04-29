// Generate mock matches for demo
export async function generateMockMatches(count = 150) {
  const maps = [
    "Contaminated",
    "Operation Firestorm",
    "Eastwood",
    "Mirak Valley",
    "Iberian Offensive",
    "Manhattan Bridge",
    "Liberation Peak",
    "Siege of Kairo",
  ];
  const modes = ["Conquest", "Escalation"];

  const startDate = new Date("2026-02-23");
  const endDate = new Date("2026-04-29");

  const matches = [];
  for (let i = 0; i < count; i++) {
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );
    matches.push({
      kills: Math.floor(Math.random() * (50 - 16 + 1)) + 16,
      deaths: Math.floor(Math.random() * (20 - 3 + 1)) + 3,
      score: Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000,
      map: maps[Math.floor(Math.random() * maps.length)],
      mode: modes[Math.floor(Math.random() * modes.length)],
      win: Math.random() < 0.5,
      date: randomDate,
    });
  }
  return matches.sort((a, b) => b.date - a.date);
}
