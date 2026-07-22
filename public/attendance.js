const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const user = JSON.parse(localStorage.getItem('user'));
const params = new URLSearchParams(window.location.search);
const trainingId = params.get('trainingId');

const playerList = document.getElementById('playerList');
const messageDiv = document.getElementById('message');

const statuses = [
  { value: 'PRESENT', label: 'Présent' },
  { value: 'ABSENT_EXCUSED', label: 'Absence excusée' },
  { value: 'ABSENT_UNEXCUSED', label: 'Absence non excusée' },
  { value: 'INJURED', label: 'Blessé' },
];

const selectedStatus = {};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

async function init() {
  const trainingRes = await fetch(`/trainings/${trainingId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const trainingResult = await trainingRes.json();

  if (!trainingResult.success) {
    messageDiv.textContent = trainingResult.error;
    return;
  }

  const training = trainingResult.data;
  document.getElementById('trainingDate').textContent = formatDate(training.date);
  document.getElementById('backLink').href = `trainings.html?teamId=${training.teamId}`;

  training.attendances.forEach((a) => {
    selectedStatus[a.playerId] = a.status;
  });

  const playersRes = await fetch(`/players/team/${training.teamId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const playersResult = await playersRes.json();

  playerList.innerHTML = '';
  playersResult.data.forEach((player) => {
    const row = document.createElement('div');
    row.className = 'player-row';

    const name = document.createElement('span');
    name.className = 'player-name';
    name.textContent = `${player.firstName} ${player.lastName}`;

    const buttons = document.createElement('div');
    buttons.className = 'status-buttons';

    statuses.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = 'status-btn';
      btn.textContent = s.label;
      if (selectedStatus[player.id] === s.value) {
        btn.classList.add(`active-${s.value}`);
      }
      btn.addEventListener('click', () => {
        selectedStatus[player.id] = s.value;
        buttons.querySelectorAll('.status-btn').forEach((b) => {
          b.className = 'status-btn';
        });
        btn.classList.add(`active-${s.value}`);
      });
      buttons.appendChild(btn);
    });

    row.appendChild(name);
    row.appendChild(buttons);
    playerList.appendChild(row);
  });
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const attendances = Object.entries(selectedStatus).map(([playerId, status]) => ({
    playerId: Number(playerId),
    status,
  }));

  if (attendances.length === 0) {
    messageDiv.textContent = 'Sélectionne au moins un statut avant d\'enregistrer.';
    return;
  }

  try {
    const response = await fetch('/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        trainingId: Number(trainingId),
        recordedByUserId: user.id,
        attendances,
      }),
    });
    const result = await response.json();

    if (!result.success) {
      messageDiv.textContent = result.error;
      return;
    }

    messageDiv.textContent = 'Appel enregistré avec succès.';
  } catch (err) {
    messageDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

init();