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
async function loadCoaches() {
  try {
    const response = await fetch('/auth/coaches', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) return;

    const coachList = document.getElementById('coachList');
    coachList.innerHTML = '';

    result.data.forEach((coach) => {
      const row = document.createElement('div');
      row.className = 'coach-row';
      const statusLabel = coach.active ? '' : ' (désactivé)';
      row.innerHTML = `
        <span>${coach.firstName} ${coach.lastName} — ${coach.email}${statusLabel}</span>
        <div class="coach-actions">
          <button class="rename-coach-btn">RENOMMER</button>
          <button class="danger toggle-coach-btn">${coach.active ? 'DÉSACTIVER' : 'RÉACTIVER'}</button>
        </div>
      `;

      row.querySelector('.rename-coach-btn').addEventListener('click', async () => {
        const firstName = prompt('Prénom :', coach.firstName);
        if (firstName === null) return;
        const lastName = prompt('Nom :', coach.lastName);
        if (lastName === null) return;

        try {
          const res = await fetch(`/auth/users/${coach.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ firstName, lastName }),
          });
          const result2 = await res.json();
          if (!result2.success) {
            errorDiv.textContent = result2.error;
            return;
          }
          loadCoaches();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });

      row.querySelector('.toggle-coach-btn').addEventListener('click', async () => {
        const newActive = !coach.active;
        const confirmed = confirm(`${newActive ? 'Réactiver' : 'Désactiver'} ${coach.firstName} ${coach.lastName} ?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`/auth/users/${coach.id}/active`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ active: newActive }),
          });
          const result2 = await res.json();
          if (!result2.success) {
            errorDiv.textContent = result2.error;
            return;
          }
          loadCoaches();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });

      coachList.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

loadCoaches();