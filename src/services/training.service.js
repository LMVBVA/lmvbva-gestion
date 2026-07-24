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
async function generateTrainings(teamId) {
  const team = await prisma.team.findUnique({ where: { id: Number(teamId) } });
  if (!team) throw new Error('TEAM_NOT_FOUND');
  if (!team.seasonStartDate || !team.seasonEndDate) throw new Error('NO_SEASON_DATES');

  const slots = await prisma.trainingSlot.findMany({ where: { teamId: Number(teamId) } });
  if (slots.length === 0) throw new Error('NO_SLOTS');

  const excludedPeriods = await prisma.excludedPeriod.findMany({
    where: team.isYouth ? {} : { youthOnly: false },
  });

  const existingTrainings = await prisma.training.findMany({
    where: { teamId: Number(teamId), slotId: { not: null } },
    select: { date: true },
  });
  const existingDates = new Set(existingTrainings.map((t) => t.date.toDateString()));

  function isExcluded(date) {
    return excludedPeriods.some((p) => date >= new Date(p.startDate) && date <= new Date(p.endDate));
  }

  const toCreate = [];
  const start = new Date(team.seasonStartDate);
  const end = new Date(team.seasonEndDate);

  for (const slot of slots) {
    let current = new Date(start);
    while (current.getDay() !== slot.dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      if (!isExcluded(current) && !existingDates.has(current.toDateString())) {
        const [hours, minutes] = slot.startTime.split(':');
        const trainingDate = new Date(current);
        trainingDate.setHours(Number(hours), Number(minutes), 0, 0);

        toCreate.push({
          teamId: Number(teamId),
          slotId: slot.id,
          date: trainingDate,
        });
        existingDates.add(current.toDateString());
      }
      current.setDate(current.getDate() + 7);
    }
  }

  if (toCreate.length > 0) {
    await prisma.training.createMany({ data: toCreate });
  }

  return { created: toCreate.length };
}

module.exports = { getAllTrainings, getTrainingsByTeam, getTrainingById, createTraining, generateTrainings };
