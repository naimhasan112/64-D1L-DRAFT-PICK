// 🔥 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("draft");

const captains = Array.from({ length: 64 }, (_, i) => `Captain ${i+1}`);
const players = Array.from({ length: 64 }, (_, i) => `Player ${i+1}`);

const captainSelect = document.getElementById("captainSelect");
const playerSelect = document.getElementById("playerSelect");
const tableBody = document.getElementById("tableBody");

let picks = {};

function refreshSelectors() {
  captainSelect.innerHTML = "";
  playerSelect.innerHTML = "";

  captains.forEach(c => {
    if (!picks[c]) {
      let opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      captainSelect.appendChild(opt);
    }
  });

  players.forEach(p => {
    if (!Object.values(picks).includes(p)) {
      let opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      playerSelect.appendChild(opt);
    }
  });
}

function submitPick() {
  const captain = captainSelect.value;
  const player = playerSelect.value;
  if (!captain || !player) return;

  db.child(captain).set(player);
}

function removePick(captain) {
  db.child(captain).remove();
}

db.on("value", snap => {
  picks = snap.val() || {};
  renderTable();
  refreshSelectors();
});

function renderTable() {
  tableBody.innerHTML = "";
  Object.entries(picks).forEach(([captain, player]) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${captain}</td>
      <td>${player}</td>
      <td><button onclick="removePick('${captain}')">Edit</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

refreshSelectors();
