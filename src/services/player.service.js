const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllPlayers() {
  return prisma.player.findMany({
    where: { active: true },
    include: { team: true },
  });
}

async function getPlayersByTeam(teamId) {
  return prisma.player.findMany({
    where: { teamId: Number(teamId), active: true },
  });
}

async function createPlayer(data) {
  return prisma.player.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      teamId: Number(data.teamId),
    },
  });
}
async function updatePlayer(id, data) {
  return prisma.player.update({
    where: { id: Number(id) },
    data: { firstName: data.firstName, lastName: data.lastName },
  });
}

async function togglePlayerActive(id, active) {
  return prisma.player.update({
    where: { id: Number(id) },
    data: { active },
  });
}

module.exports = { getAllPlayers, getPlayersByTeam, createPlayer, updatePlayer, togglePlayerActive };