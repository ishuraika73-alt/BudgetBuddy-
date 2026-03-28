// Authentication
function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;
  if (!name || !email || !password) { alert("Fill all fields"); return; }
  localStorage.setItem("user", JSON.stringify({name, email, password}));
  alert("Signup successful! Please login.");
}
function login() {
  let name = document.getElementById("login-name").value;
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name === name && user.email === email && user.password === password) {
    showScreen("home-screen");
    loadHome();
  } else { alert("Invalid credentials"); }
}
// Navigation
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Transactions
function addTransaction() {
  let t = {
    title: document.getElementById("t-title").value,
    amount: parseFloat(document.getElementById("t-amount").value),
    type: document.getElementById("t-type").value,
    category: document.getElementById("t-category").value,
    date: document.getElementById("t-date").value,
    folder: document.getElementById("t-folder").value
  };
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(t);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  alert("Transaction saved!");
  showScreen("home-screen");
  loadHome();
}
// Home
function loadHome() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let balance = 0;
  transactions.forEach(t => {
    balance += (t.type === "income" ? t.amount : -t.amount);
  });
  document.getElementById("balance").innerText = balance;
  let recent = transactions.slice(-5).reverse();
  let list = document.getElementById("recent-transactions");
  list.innerHTML = "";
  recent.forEach(t => {
    let li = document.createElement("li");
    li.textContent = `${t.title} - ₹${t.amount} (${t.type})`;
    list.appendChild(li);
  });
}

// Folders
function loadFolders() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let folders = {};
  transactions.forEach(t => {
    if (!folders[t.folder]) folders[t.folder] = [];
    folders[t.folder].push(t);
  });
let grid
= document.getElementById("folders-grid");
  grid.innerHTML = "";
  Object.keys(folders).forEach(f => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${f}</h3><p>${folders[f].length} transactions</p>`;
    card.onclick = () => showFolder(folders[f], f);
    grid.appendChild(card);
  });
}
function showFolder(transactions, folderName) {
  let grid = document.getElementById("folders-grid");
  grid.innerHTML = `<h3>${folderName}</h3>`;
  transactions.forEach(t => {
    let div = document.createElement("div");
    div.className = "card";
    div.textContent = `${t.title} - ₹${t.amount} (${t.type})`;
    grid.appendChild(div);
  });
}

// Reports
function loadReports() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let totals = {daily:0, weekly:0, monthly:0, yearly:0};
  let now = new Date();
  transactions.forEach(t => {
    let d = new Date(t.date);
    let diffDays = (now - d)/(1000*60*60*24);
    if (diffDays <= 1) totals.daily += t.amount;
    if (diffDays <= 7) totals.weekly += t.amount;
    if (diffDays <= 30) totals.monthly += t.amount;
    if (diffDays <= 365) totals.yearly += t.amount;
  });
  let reportDiv = document.getElementById("report-cards");
  reportDiv.innerHTML = `
    <div class="card">Daily: ₹${totals.daily}</div>
    <div class="card">Weekly: ₹${totals.weekly}</div>
    <div class="card">Monthly: ₹${totals.monthly}</div>
    <div class="card">Yearly: ₹${totals.yearly}</div>`;
  // Simple bar chart
  let ctx = document.getElementById("report-chart").getContext("2d");
  if (window.reportChart) window.reportChart.destroy();
  window.reportChart = new Chart(ctx, {
    type: 'bar',
data: {
      labels: ['Daily','Weekly','Monthly','Yearly'],
      datasets: [{label:'Expenses', data:[totals.daily,totals.weekly,totals.monthly,totals.yearly],
                  backgroundColor:'#3498db'}]
    }
  });
}

// Reminder
function setReminder() {
  let title = document.getElementById("r-title").value;
  let limit = parseFloat(document.getElementById("r-limit").value);
  let date = new Date(document.getElementById("r-date").value);
  let now = new Date();
  let delay = date - now;
  if (delay <= 0) { alert("Invalid date"); return; }
  setTimeout(() => {
    alert(`Reminder: ${title} - Limit ₹${limit}`);
  }, delay);
  alert("Reminder set!");
}
