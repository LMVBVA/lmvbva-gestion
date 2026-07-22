const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPlayerStats(playerId) {
  const attendances = await prisma.attendance.findMany({
    where: {
      playerId: Number(playerId),
    },
  });

  const total = attendances.length;
 const present = attendances.filter((a) => a.status === 'PRESENT').length;

  const rate = total === 0 ? null : Math.round((present / total) * 100);

 const breakdown = {
    PRESENT: attendances.filter((a) => a.status === 'PRESENT').length,
    ABSENT_EXCUSED: attendances.filter((a) => a.status === 'ABSENT_EXCUSED').length,
    ABSENT_UNEXCUSED: attendances.filter((a) => a.status === 'ABSENT_UNEXCUSED').length,
    INJURED: attendances.filter((a) => a.status === 'INJURED').length,
  };

  return { total, rate, breakdown };
}

async function getTeamStats(teamId) {
  const players = await prisma.player.findMany({
    where: { teamId: Number(teamId), active: true },
  });

  const results = [];
  for (const player of players) {
    const stats = await getPlayerStats(player.id);
    results.push({
      playerId: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      ...stats,
    });
  }

  return results;
}
async function getTeamAverage(teamId) {
  const stats = await getTeamStats(teamId);
  const withData = stats.filter((s) => s.rate !== null);

  if (withData.length === 0) {
    return { average: null, playersCount: stats.length };
  }

  const average = Math.round(withData.reduce((sum, s) => sum + s.rate, 0) / withData.length);
  return { average, playersCount: stats.length };
}

module.exports = { getPlayerStats, getTeamStats, getTeamAverage };