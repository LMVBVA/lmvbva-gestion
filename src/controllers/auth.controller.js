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

module.exports = { login };