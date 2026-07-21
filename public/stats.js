const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');

document.getElementById('backLink').href = `trainings.html?teamId=${teamId}`;

const statsList = document.getElementById('statsList');
const errorDiv = document.getElementById('error');

async function loadStats() {
  try {
    const response = await fetch(`/stats/team/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    statsList.innerHTML = '';
    result.data.forEach((player) => {
      const row = document.createElement('div');
      row.className = 'stats-row';

      const rateDisplay = player.rate === null
        ? '<span class="rate no-data">Pas assez de données</span>'
        : `<span class="rate">${player.rate}%</span>`;

      row.innerHTML = `
        <div>
          <div class="player-name">${player.firstName} ${player.lastName}</div>
          <div class="detail">${player.total} entraînement(s) pris en compte</div>
        </div>
        ${rateDisplay}
      `;
      statsList.appendChild(row);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

loadStats();