const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTeams() {
  return prisma.team.findMany({
    include: {
      players: true,
    },
  });
}

async function getTeamById(id) {
  return prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      players: true,
    },
  });
}

module.exports = { getAllTeams, getTeamById };