const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');
document.getElementById('statsLink').href = `stats.html?teamId=${teamId}`;
const trainingList = document.getElementById('trainingList');
const errorDiv = document.getElementById('error');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const dateText = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeText = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${dateText} — ${timeText}`;
}

async function loadTrainings() {
  try {
    const response = await fetch(`/trainings/team/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    trainingList.innerHTML = '';
    result.data.forEach((training) => {
      const card = document.createElement('div');
      card.className = 'training-card';
      card.innerHTML = `<span>${formatDate(training.date)}</span>`;
      card.addEventListener('click', () => {
        window.location.href = `attendance.html?trainingId=${training.id}`;
      });
      trainingList.appendChild(card);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

document.getElementById('createBtn').addEventListener('click', async () => {
  const dateValue = document.getElementById('newDate').value;
  const timeValue = document.getElementById('newTime').value || '00:00';
  if (!dateValue) {
    errorDiv.textContent = 'Choisis une date.';
    return;
  }
  const date = `${dateValue}T${timeValue}:00`;

  try {
    const response = await fetch('/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ date, teamId }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    document.getElementById('newDate').value = '';
    errorDiv.textContent = '';
    loadTrainings();
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

loadTrainings();