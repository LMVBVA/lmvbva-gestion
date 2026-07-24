const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');
document.getElementById('statsLink').href = `stats.html?teamId=${teamId}`;
document.getElementById('slotsLink').href = `manage-slots.html?teamId=${teamId}`;
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

   const now = new Date();
    const todayStr = now.toDateString();

    const todayTraining = result.data.find((t) => new Date(t.date).toDateString() === todayStr);
    const futureTrainings = result.data.filter((t) => new Date(t.date) > now);
    const pastTrainings = result.data.filter((t) => new Date(t.date) < now && new Date(t.date).toDateString() !== todayStr);
    const nextTraining = futureTrainings.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    const todaySection = document.getElementById('todaySection');
    if (todayTraining) {
      todaySection.innerHTML = `
        <div class="training-card" style="border-color:#f5c400;">
          <span><strong>AUJOURD'HUI</strong> — ${formatDate(todayTraining.date)}</span>
        </div>
      `;
      todaySection.querySelector('.training-card').addEventListener('click', () => {
        window.location.href = `attendance.html?trainingId=${todayTraining.id}`;
      });
    } else if (nextTraining) {
      todaySection.innerHTML = `
        <div class="training-card" style="border-color:#f5c400;">
          <span><strong>PROCHAIN ENTRAÎNEMENT</strong> — ${formatDate(nextTraining.date)}</span>
        </div>
      `;
      todaySection.querySelector('.training-card').addEventListener('click', () => {
        window.location.href = `attendance.html?trainingId=${nextTraining.id}`;
      });
    } else {
      todaySection.innerHTML = `<p style="text-align:center; color:#888; max-width:700px; margin:0 auto;">Aucun entraînement prévu.</p>`;
    }

    trainingList.innerHTML = '';
    pastTrainings
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((training) => {
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