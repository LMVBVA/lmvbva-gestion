const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSlotsByTeam(teamId) {
  return prisma.trainingSlot.findMany({
    where: { teamId: Number(teamId) },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
}

async function createSlot(data) {
  return prisma.trainingSlot.create({
    data: {
      teamId: Number(data.teamId),
      dayOfWeek: Number(data.dayOfWeek),
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
}

async function deleteSlot(id) {
  return prisma.trainingSlot.delete({
    where: { id: Number(id) },
  });
}

module.exports = { getSlotsByTeam, createSlot, deleteSlot };