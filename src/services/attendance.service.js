const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recordBulkAttendance(trainingId, attendances, recordedByUserId) {
  const results = [];

  for (const entry of attendances) {
    const result = await prisma.attendance.upsert({
      where: {
        trainingId_playerId: {
          trainingId: Number(trainingId),
          playerId: Number(entry.playerId),
        },
      },
      update: {
        status: entry.status,
        recordedByUserId: Number(recordedByUserId),
        recordedAt: new Date(),
      },
      create: {
        trainingId: Number(trainingId),
        playerId: Number(entry.playerId),
        status: entry.status,
        recordedByUserId: Number(recordedByUserId),
      },
    });
    results.push(result);
  }

  return results;
}

async function getAttendanceByTraining(trainingId) {
  return prisma.attendance.findMany({
    where: { trainingId: Number(trainingId) },
    include: { player: true },
  });
}

async function getAttendanceByPlayer(playerId) {
  return prisma.attendance.findMany({
    where: { playerId: Number(playerId) },
    include: { training: true },
    orderBy: { recordedAt: 'desc' },
  });
}

module.exports = { recordBulkAttendance, getAttendanceByTraining, getAttendanceByPlayer };