const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTrainings() {
  return prisma.training.findMany({
    include: { team: true },
    orderBy: { date: 'desc' },
  });
}

async function getTrainingsByTeam(teamId) {
  return prisma.training.findMany({
    where: { teamId: Number(teamId) },
    orderBy: { date: 'desc' },
  });
}

async function getTrainingById(id) {
  return prisma.training.findUnique({
    where: { id: Number(id) },
    include: {
      team: true,
      attendances: { include: { player: true } },
    },
  });
}

async function createTraining(data) {
  return prisma.training.create({
    data: {
      date: new Date(data.date),
      teamId: Number(data.teamId),
    },
  });
}

async function updateTeam(id, name) {
  return prisma.team.update({
    where: { id: Number(id) },
    data: { name },
  });
}

async function toggleTeamActive(id, active) {
  return prisma.team.update({
    where: { id: Number(id) },
    data: { active },
  });
}

module.exports = { getAllTrainings, getTrainingsByTeam, getTrainingById, createTraining };
