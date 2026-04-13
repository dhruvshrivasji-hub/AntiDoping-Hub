// ── Substances Data ──
const substances = [
  { name: "Pseudoephedrine",      cat: "Stimulants",         status: "orange", label: "In-Competition Only", note: "Threshold: 150 mcg/mL" },
  { name: "Testosterone",         cat: "Anabolic Agents",    status: "red",    label: "Always Prohibited",   note: "—" },
  { name: "Salbutamol",           cat: "Stimulants",         status: "orange", label: "In-Competition Only", note: "Threshold: 1000 ng/mL" },
  { name: "Erythropoietin (EPO)", cat: "Peptide Hormones",   status: "red",    label: "Always Prohibited",   note: "—" },
  { name: "Insulin",              cat: "Peptide Hormones",   status: "red",    label: "Always Prohibited",   note: "—" },
  { name: "Cannabis / THC",       cat: "Cannabinoids",       status: "orange", label: "In-Competition Only", note: "Threshold applies" },
  { name: "Ibuprofen",            cat: "NSAIDs",             status: "green",  label: "Permitted",           note: "—" },
  { name: "Caffeine",             cat: "Monitoring Program", status: "green",  label: "Permitted",           note: "Monitored" },
];

// ── Navigate Between Pages ──
function go(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'substances') renderTable();
}

// ── Render Substances Table ──
function renderTable(query = '') {
  const filtered = substances.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.cat.toLowerCase().includes(query.toLowerCase())
  );

  const tbody = document.getElementById('tableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--gray);">No results for "${query}"</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td style="color:var(--gray)">${s.cat}</td>
      <td><span class="badge ${s.status}">${s.label}</span></td>
      <td style="color:var(--gray);font-size:0.82rem;">${s.note}</td>
    </tr>
  `).join('');
}

// ── Filter Table on Search Input ──
function filterTable() {
  const query = document.getElementById('search').value;
  renderTable(query);
}

// ── Set Footer Year ──
document.getElementById('yr').textContent = '© ' + new Date().getFullYear() + ' CleanSport. All rights reserved.';

// ── Initial Table Render ──
renderTable();
