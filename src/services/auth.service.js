const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!user.active) {
    throw new Error('ACCOUNT_DISABLED');
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };