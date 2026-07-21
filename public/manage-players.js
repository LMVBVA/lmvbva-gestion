const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');

const playerList = document.getElementById('playerList');
const errorDiv = document.getElementById('error');
const coachSelect = document.getElementById('coachSelect');
const currentCoaches = document.getElementById('currentCoaches');

async function loadPlayers() {
  try {
    const response = await fetch(`/players/team/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    playerList.innerHTML = '';
    result.data.forEach((player) => {
      const row = document.createElement('div');
      row.className = 'player-row';
      row.textContent = `${player.firstName} ${player.lastName}`;
      playerList.appendChild(row);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

async function loadCoaches() {
  try {
    const response = await fetch('/teams/coaches', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) return;

    coachSelect.innerHTML = '<option value="">-- Choisir un entraîneur --</option>';
    result.data.forEach((coach) => {
      const option = document.createElement('option');
      option.value = coach.id;
      option.textContent = `${coach.firstName} ${coach.lastName}`;
      coachSelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadTeamDetail() {
  try {
    const response = await fetch(`/teams/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    if (!result.success) return;
  } catch (err) {
    console.error(err);
  }
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  if (!firstName || !lastName) {
    errorDiv.textContent = 'Prénom et nom sont requis.';
    return;
  }

  try {
    const response = await fetch('/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, teamId }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    errorDiv.textContent = '';
    loadPlayers();
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

document.getElementById('assignBtn').addEventListener('click', async () => {
  const userId = coachSelect.value;
  if (!userId) {
    errorDiv.textContent = 'Choisis un entraîneur.';
    return;
  }

  try {
    const response = await fetch(`/teams/${teamId}/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    errorDiv.textContent = '';
    currentCoaches.textContent = 'Entraîneur affecté avec succès.';
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

loadPlayers();
loadCoaches();