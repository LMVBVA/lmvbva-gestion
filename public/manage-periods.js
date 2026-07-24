const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const periodList = document.getElementById('periodList');
const errorDiv = document.getElementById('error');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function loadPeriods() {
  try {
    const response = await fetch('/excluded-periods', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    periodList.innerHTML = '';
    result.data.forEach((period) => {
      const row = document.createElement('div');
      row.className = 'period-row';
      const tag = period.youthOnly ? ' (jeunes uniquement)' : '';
      row.innerHTML = `
        <span>${period.label} — du ${formatDate(period.startDate)} au ${formatDate(period.endDate)}${tag}</span>
        <button class="delete-period-btn">SUPPRIMER</button>
      `;
      row.querySelector('.delete-period-btn').addEventListener('click', async () => {
        const confirmed = confirm(`Supprimer "${period.label}" ?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`/excluded-periods/${period.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const result2 = await res.json();
          if (!result2.success) {
            errorDiv.textContent = result2.error;
            return;
          }
          loadPeriods();
        } catch (err) {
          errorDiv.textContent = 'Erreur de connexion au serveur.';
        }
      });
      periodList.appendChild(row);
    });
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const label = document.getElementById('label').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const youthOnly = document.getElementById('youthOnly').value === 'true';

  if (!label || !startDate || !endDate) {
    errorDiv.textContent = 'Tous les champs sont requis.';
    return;
  }

  try {
    const response = await fetch('/excluded-periods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ label, startDate, endDate, youthOnly }),
    });
    const result = await response.json();

    if (!result.success) {
      errorDiv.textContent = result.error;
      return;
    }

    document.getElementById('label').value = '';
    errorDiv.textContent = '';
    loadPeriods();
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur.';
  }
});

loadPeriods();