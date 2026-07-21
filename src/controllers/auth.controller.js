const authService = require('../services/auth.service');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email et mot de passe requis.' });
  }

  try {
    const result = await authService.login(email, password);
    return res.json({ success: true, data: result });
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect.' });
    }
    if (err.message === 'ACCOUNT_DISABLED') {
      return res.status(401).json({ success: false, error: 'Ce compte est désactivé.' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
async function createUser(req, res) {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Seul un administrateur peut créer un utilisateur.' });
  }

  try {
    const user = await authService.createUser({ firstName, lastName, email, password, role });
    return res.status(201).json({
      success: true,
      data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé.' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
module.exports = { login, createUser };