const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllExcludedPeriods() {
  return prisma.excludedPeriod.findMany({
    orderBy: { startDate: 'asc' },
  });
}

async function createExcludedPeriod(data) {
  return prisma.excludedPeriod.create({
    data: {
      label: data.label,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      youthOnly: !!data.youthOnly,
    },
  });
}

async function deleteExcludedPeriod(id) {
  return prisma.excludedPeriod.delete({
    where: { id: Number(id) },
  });
}

module.exports = { getAllExcludedPeriods, createExcludedPeriod, deleteExcludedPeriod };