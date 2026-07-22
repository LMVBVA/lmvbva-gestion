const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

const teamList = document.getElementById('teamList');
const errorDiv = document.getElementById('error');

async function loadTeams() {
  try {
    const response = await fetch('/teams', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    teamList.innerHTML = '';
    result.data.forEach((team) => {
      const card = document.createElement('div');
      card.className = 'team-card';
card.innerHTML = `
        <span class="team-name">${team.name}</span>
        <div class="team-actions">
          <span class="team-count">${team.players.length} joueur(s)</span>
          <button class="players-btn">JOUEURS</button>
          <button class="trainings-btn">ENTRAÎNEMENTS</button>
          <button class="rename-btn">RENOMMER</button>
          <button class="danger deactivate-btn">DÉSACTIVER</button>
        </div>
      `;
      card.querySelector('.players-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `manage-players.html?teamId=${team.id}`;
      });
      card.querySelector('.trainings-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `trainings.html?teamId=${team.id}`;
      });
      card.querySelector('.rename-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const newName = prompt('Nouveau nom de l\'équipe :', team.name);
        if (!newName || newName.trim() === '') return;

        try {
          const response = await fetch(`/teams/${team.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName.trim() }),
          });
          const result = await response.json();
          if (!result.success) {
            errorDiv.textContent = result.error;
            return;
          }
          loadTeams();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });
      card.querySelector('.deactivate-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const confirmed = confirm(`Désactiver l'équipe "${team.name}" ? Elle n'apparaîtra plus dans la liste, mais son historique sera conservé.`);
        if (!confirmed) return;

        try {
          const response = await fetch(`/teams/${team.id}/active`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ active: false }),
          });
          const result = await response.json();
          if (!result.success) {
            errorDiv.textContent = result.error;
            return;
          }
          loadTeams();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });
      teamList.appendChild(card);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

loadTeams();
document.getElementById('createTeamBtn').addEventListener('click', async () => {
  const name = document.getElementById('newTeamName').value.trim();
  if (!name) {
    errorDiv.textContent = 'Le nom de l\'équipe est requis.';
    return;
  }

  try {
    const response = await fetch('/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    document.getElementById('newTeamName').value = '';
    errorDiv.textContent = '';
    loadTeams();
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});