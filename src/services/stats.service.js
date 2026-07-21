const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPlayerStats(playerId) {
  const attendances = await prisma.attendance.findMany({
    where: {
      playerId: Number(playerId),
    },
  });

  const total = attendances.length;
  const present = attendances.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;

  const rate = total === 0 ? null : Math.round((present / total) * 100);

  const breakdown = {
    PRESENT: attendances.filter((a) => a.status === 'PRESENT').length,
    ABSENT: attendances.filter((a) => a.status === 'ABSENT').length,
    EXCUSED: attendances.filter((a) => a.status === 'EXCUSED').length,
    LATE: attendances.filter((a) => a.status === 'LATE').length,
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

module.exports = { getPlayerStats, getTeamStats };