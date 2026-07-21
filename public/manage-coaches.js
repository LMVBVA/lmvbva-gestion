const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const user = JSON.parse(localStorage.getItem('user'));
if (user.role !== 'ADMIN') {
  alert('Accès réservé aux administrateurs.');
  window.location.href = 'teams.html';
}

const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');

document.getElementById('createBtn').addEventListener('click', async () => {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  errorDiv.textContent = '';
  successDiv.textContent = '';

  if (!firstName || !lastName || !email || !password) {
    errorDiv.textContent = 'Tous les champs sont requis.';
    return;
  }

  try {
    const response = await fetch('/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, email, password, role: 'COACH' }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    successDiv.textContent = `Entraîneur ${result.data.firstName} ${result.data.lastName} créé avec succès.`;
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});