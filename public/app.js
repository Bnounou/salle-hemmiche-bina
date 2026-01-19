
const mois = ["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];

async function load() {
  const sport = document.getElementById("sport").value;
  const res = await fetch(`/api/athletes?sport=${sport}`);
  const data = await res.json();

  const table = document.getElementById("table");
  table.innerHTML = "<tr><th>Nom</th>" +
    mois.map(m => `<th>${m}</th>`).join("") +
    "<th>❌</th></tr>";

  data.forEach(a => {
    let row = `<tr><td>${a.nom}</td>`;
    a.paiements.forEach(p => {
      row += `<td>
        <input type="checkbox" ${p.paye ? "checked" : ""}
          onchange="payer(${p.id}, this.checked)">
      </td>`;
    });
    row += `<td><button onclick="supprimer(${a.id})">X</button></td></tr>`;
    table.innerHTML += row;
  });
}

async function addAthlete() {
  await fetch("/api/athletes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom: document.getElementById("nom").value,
      sport: document.getElementById("sport").value
    })
  });
  load();
}

async function payer(id, paye) {
  await fetch("/api/payer", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paiementId: id, paye })
  });
}

async function supprimer(id) {
  await fetch(`/api/athletes/${id}`, { method: "DELETE" });
  load();
}

document.getElementById("sport").onchange = load;
load();
