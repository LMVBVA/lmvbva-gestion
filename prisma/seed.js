const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('motdepasse123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lmvbva.fr' },
    update: {},
    create: {
      firstName: 'Erik',
      lastName: 'Admin',
      email: 'admin@lmvbva.fr',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const team = await prisma.team.upsert({
    where: { name: 'Seniors M1' },
    update: {},
    create: { name: 'Seniors M1' },
  });

  await prisma.coachTeam.upsert({
    where: { userId_teamId: { userId: admin.id, teamId: team.id } },
    update: {},
    create: { userId: admin.id, teamId: team.id },
  });

  const player1 = await prisma.player.upsert({
    where: { id: 1 },
    update: {},
    create: { firstName: 'Lucas', lastName: 'Martin', teamId: team.id },
  });

  const player2 = await prisma.player.upsert({
    where: { id: 2 },
    update: {},
    create: { firstName: 'Yanis', lastName: 'Dubois', teamId: team.id },
  });

  const training = await prisma.training.create({
    data: {
      date: new Date(),
      teamId: team.id,
    },
  });

  console.log('Données de test créées avec succès :');
  console.log({ admin: admin.email, team: team.name, players: [player1.firstName, player2.firstName], training: training.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });