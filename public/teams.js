const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

const teamList = document.getElementById('teamList');
const errorDiv = document.getElementById('error');

async function loadTeams() {
  try {
    const response = await fetch('/teams');
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
        <span class="team-count">${team.players.length} joueur(s)</span>
      `;
      card.addEventListener('click', () => {
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