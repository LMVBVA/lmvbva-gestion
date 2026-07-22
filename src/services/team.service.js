const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTeams(user) {
  if (user.role === 'ADMIN') {
    return prisma.team.findMany({
      where: { active: true },
      include: { players: true },
    });
  }

  return prisma.team.findMany({
    where: { active: true, coaches: { some: { userId: user.userId } } },
    include: { players: true },
  });
}

async function getTeamById(id) {
  return prisma.team.findUnique({
    where: { id: Number(id) },
    include: { players: true },
  });
}

async function getAllCoaches() {
  return prisma.user.findMany({
    where: { role: 'COACH', active: true },
  });
}

async function assignCoach(teamId, userId) {
  return prisma.coachTeam.upsert({
    where: {
      userId_teamId: {
        userId: Number(userId),
        teamId: Number(teamId),
      },
    },
    update: {},
    create: {
      userId: Number(userId),
      teamId: Number(teamId),
    },
  });
}

async function createTeam(name) {
  return prisma.team.create({
    data: { name },
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

module.exports = { getAllTeams, getTeamById, getAllCoaches, assignCoach, createTeam, updateTeam, toggleTeamActive };