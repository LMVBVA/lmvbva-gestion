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