const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');
document.getElementById('statsLink').href = `stats.html?teamId=${teamId}`;
const trainingList = document.getElementById('trainingList');
const errorDiv = document.getElementById('error');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
  const date = document.getElementById('newDate').value;
  if (!date) {
    errorDiv.textContent = 'Choisis une date.';
    return;
  }

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