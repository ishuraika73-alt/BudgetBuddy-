// Quotes
const quotes = [
  "Track every rupee, build every dream.",
  "Discipline beats motivation.",
  "Small savings create big wealth.",
  "Money flows where attention goes."
];

// Show screen
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "home-screen") loadHome();
  if (id === "transactions-screen") loadTransactions();
  if (id === "accounts-screen") loadPersons();
}

// Signup/Login
function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;
  if (!name || !email || !password) { alert("Fill all fields"); return; }
  localStorage.setItem("user", JSON.stringify({name,email,password}));
  alert("Signup successful! Please login.");
  showScreen("login-screen");
}
function login() {
  let name = document.getElementById("login-name").value;
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name===name && user.email===email && user.password===password) {
    showScreen("home-screen");
    loadHome();
  } else {
    alert("Invalid credentials");
  }
}

// Load Home
function loadHome() {
  let user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("username").innerText = user ? user.name : "";
  document.getElementById("quote").innerText = quotes[Math.floor(Math.random()*quotes.length)];

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  transactions.forEach(t => {
    balance += (t.type==="income" ? t.amount : -t.amount);
  });
  document.getElementById("balance").innerText = balance;

let recent = transactions.slice(-3).reverse();
  let list = document.getElementById("recent-transactions");
  list.innerHTML = "";
  recent.forEach(t => {
    let li = document.createElement("li");
    li.textContent = `${t.title} - ₹${t.amount} (${t.type})`;
    list.appendChild(li);
  });

  // Quick actions
  let quick = document.getElementById("quick-actions");
  quick.innerHTML = "";
  ["Add Transaction","Important","Reminder","Reports"].forEach(action=>{
    let card = document.createElement("div");
    card.className="card";
    card.textContent=action;
    card.onclick=()=>{
      if(action==="Add Transaction") showScreen("add-screen");
      if(action==="Important") showImportant();
      if(action==="Reminder") showScreen("add-screen"); // placeholder
      if(action==="Reports") showReports();
    };
    quick.appendChild(card);
  });
}
// Add Transaction
function addTransaction() {
  let title=document.getElementById("t-title").value;
  let amount=parseFloat(document.getElementById("t-amount").value);
  let type=document.querySelector('input[name="type"]:checked').value;
  let category=document.getElementById("t-category").value;
  let person=document.getElementById("t-person").value;
  let important=document.getElementById("t-important").checked;
  let date=document.getElementById("t-date").value;
  if(!title||!amount||!date){alert("Fill required fields");return;}
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  transactions.push({title,amount,type,category,person,important,date});
  localStorage.setItem("transactions",JSON.stringify(transactions));
  alert("Transaction saved!");
  showScreen("home-screen");
  loadHome();
}

// Transactions
function loadTransactions() {
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let list=document.getElementById("transactions-list");
  list.innerHTML="";
  transactions.forEach(t=>{
    let li=document.createElement("li");
    li.textContent=`${t.title} - ₹${t.amount} (${t.type}) ${t.important?"⭐":""}`;
    list.appendChild(li);
  });
}
function filterTransactions() {
  let filter=document.getElementById("filter").value;
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let now=new Date();
  let filtered=transactions.filter(t=>{
    let d=new Date(t.date);
    let diffDays=(now-d)/(1000*60*60*24);
    if(filter==="day") return diffDays<=1;
    if(filter==="week") return diffDays<=7;
    if(filter==="month") return diffDays<=30;
    if(filter==="year") return diffDays<=365;
    return true;
  });
  let list=document.getElementById("transactions-list");
  list.innerHTML="";
  filtered.forEach(t=>{
    let li=document.createElement("li");
    li.textContent=`${t.title} - ₹${t.amount} (${t.type}) ${t.important?"⭐":""}`;
    list.appendChild(li);
  });
}

// Important Transactions
function showImportant() {
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let important=transactions.filter(t=>t.important);
  alert("Important Transactions:\n"+important.map(t=>`${t.title} - ₹${t.amount}`).join("\n"));
}

// Persons/Accounts
function addPerson() {
  let name=document.getElementById("person-name").value;
  if(!name){alert("Enter name");return;}
  let persons=JSON.parse(localStorage.getItem("persons"))||[];
  persons.push({name,balance:0});
  localStorage.setItem("persons",JSON.stringify(persons));
  loadPersons();
}
function loadPersons() {
  let persons=JSON.parse(localStorage.getItem("persons"))||[];
  let list=document.getElementById("persons-list");
  list.innerHTML="";
  let select=document.getElementById("t-person");
  select.innerHTML="";
  persons.forEach(p=>{
    let li=document.createElement("li");
    li.textContent=`${p.name} - Balance ₹${p.balance}`;
    list.appendChild(li);
    let opt=document.createElement("option");
    opt.value=p.name; opt.textContent=p.name;
select.appendChild(opt);
  });
}
function saveBalance() {
  let balance=parseFloat(document.getElementById("set-balance").value);
  if(isNaN(balance)){alert("Enter valid balance");return;}
  localStorage.setItem("balance",balance);
  alert("Balance saved!");
  loadHome();
}

// Reports
function showReports() {
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let totals={day:0,week:0,month:0,year:0};
  let now=new Date();
  transactions.forEach(t=>{
    let d=new Date(t.date);
    let diffDays=(now-d)/(1000*60*60*24);
    if(diffDays<=1) totals.day+=t.amount;
    if(diffDays<=7) totals.week+=t.amount;
    if(diffDays<=30) totals.month+=t.amount;
    if(diffDays<=365) totals.year+=t.amount;
  });
  alert(`Reports:\nDay: ₹${totals.day}\nWeek: ₹${totals.week}\nMonth: ₹${totals.month}\nYear: ₹${totals.year}`);
}
// Reminder
function setReminder() {
  let title=document.getElementById("r-title").value;
  let limit=parseFloat(document.getElementById("r-limit").value);
  let date=new Date(document.getElementById("r-date").value);
  let now=new Date();
  let delay=date-now;
  if(delay<=0){alert("Invalid date");return;}
  setTimeout(()=>{alert(`Reminder: ${title} - Limit ₹${limit}`);},delay);
  alert("Reminder set!");
}
