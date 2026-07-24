const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const teamId = params.get('teamId');

document.getElementById('backLink').href = `trainings.html?teamId=${teamId}`;

const slotList = document.getElementById('slotList');
const errorDiv = document.getElementById('error');

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

async function loadSlots() {
  try {
    const response = await fetch(`/slots/team/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    slotList.innerHTML = '';
    result.data.forEach((slot) => {
      const row = document.createElement('div');
      row.className = 'slot-row';
      row.innerHTML = `
        <span>${dayNames[slot.dayOfWeek]} ${slot.startTime} - ${slot.endTime}</span>
        <button class="delete-slot-btn">SUPPRIMER</button>
      `;
      row.querySelector('.delete-slot-btn').addEventListener('click', async () => {
        const confirmed = confirm('Supprimer ce créneau ?');
        if (!confirmed) return;

        try {
          const res = await fetch(`/slots/${slot.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const result2 = await res.json();
          if (!result2.success) {
            errorDiv.textContent = result2.error;
            return;
          }
          loadSlots();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });
      slotList.appendChild(row);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const dayOfWeek = document.getElementById('daySelect').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!startTime || !endTime) {
    errorDiv.textContent = 'Heure de début et de fin requises.';
    return;
  }

  try {
    const response = await fetch('/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamId, dayOfWeek, startTime, endTime }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    errorDiv.textContent = '';
    loadSlots();
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

loadSlots();
document.getElementById('saveSeasonBtn').addEventListener('click', async () => {
  const seasonStartDate = document.getElementById('seasonStart').value;
  const seasonEndDate = document.getElementById('seasonEnd').value;

  try {
    const response = await fetch(`/teams/${teamId}/season`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ seasonStartDate, seasonEndDate }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    errorDiv.textContent = '';
    alert('Dates de saison enregistrées.');
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});
document.getElementById('generateBtn').addEventListener('click', async () => {
  const confirmed = confirm('Générer les entraînements pour cette équipe, sur toute la saison définie ?');
  if (!confirmed) return;

  try {
    const response = await fetch(`/trainings/generate/${teamId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    alert(`${result.data.created} entraînement(s) créé(s) avec succès.`);
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});
async function loadTeamSeasonDates() {
  try {
    const response = await fetch(`/teams/${teamId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) return;

    if (result.data.seasonStartDate) {
      document.getElementById('seasonStart').value = result.data.seasonStartDate.split('T')[0];
    }
    if (result.data.seasonEndDate) {
      document.getElementById('seasonEnd').value = result.data.seasonEndDate.split('T')[0];
    }
  } catch (err) {
    console.error(err);
  }
}

loadTeamSeasonDates();
