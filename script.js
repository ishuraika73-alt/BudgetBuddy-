// ===== AUTH FLOW =====

// Show screen helper
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if(id==="transactions-screen") loadTransactions();
  if(id==="balance-screen") loadBalance();
  if(id==="tracker-screen") updateTracker();
}

// Signup
document.getElementById("signup-form").addEventListener("submit", function(e){
  e.preventDefault(); // prevent reload
  let name=document.getElementById("signup-name").value;
  let email=document.getElementById("signup-email").value;
  let password=document.getElementById("signup-password").value;

  if(!name||!email||!password){
    alert("Fill all fields");
    return;
  }
localStorage.setItem("user",JSON.stringify({name,email,password}));
  localStorage.setItem("transactions",JSON.stringify([]));
  localStorage.setItem("balance","0");
  localStorage.setItem("folders",JSON.stringify([]));

  alert("Signup successful! Please login.");
  showScreen("login-screen");
});

// Login
document.getElementById("login-form").addEventListener("submit", function(e){
  e.preventDefault(); // prevent reload
  let email=document.getElementById("login-email").value;
  let password=document.getElementById("login-password").value;
  let user=JSON.parse(localStorage.getItem("user"));

  if(user && user.email===email && user.password===password){
    showScreen("home-screen");
  } else {
    alert("Invalid credentials");
  }
});
// ===== BALANCE =====
function saveBalance(){
  let b=document.getElementById("set-balance").value;
  localStorage.setItem("balance", b);
  alert("Balance updated!");
  loadBalance();
}
function loadBalance(){
  let balance=localStorage.getItem("balance")||0;
  document.getElementById("balance").innerText=balance;
  loadFolders();
}


// ===== TRANSACTIONS =====
function addTransaction(e){
  e.preventDefault();
  let title=document.getElementById("t-title").value;
  let amount=parseFloat(document.getElementById("t-amount").value);
  if(!title||!amount){alert("Fill required fields");return;}

  let now=new Date();
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  transactions.push({
    title,
amount,
    date:now.toLocaleDateString(),
    time:now.toLocaleTimeString()
  });
  localStorage.setItem("transactions",JSON.stringify(transactions));
  loadTransactions();
}

function loadTransactions(){
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let list=document.getElementById("transactions-list");
  list.innerHTML="";
  transactions.slice().reverse().forEach(t=>{
    let li=document.createElement("li");
    li.textContent=`${t.date} ${t.time} | ${t.title} - ₹${t.amount}`;
    list.appendChild(li);
  });
}
// ===== NOTES / FOLDERS =====
function addFolder(){
  let folder=document.getElementById("note-folder").value;
  if(!folder){alert("Enter folder name");return;}
  let folders=JSON.parse(localStorage.getItem("folders"))||{};
  if(!folders[folder]) folders[folder]=[];
  localStorage.setItem("folders",JSON.stringify(folders));
  loadFolders();
}

function loadFolders(){
  let folders=JSON.parse(localStorage.getItem("folders"))||{};
  let div=document.getElementById("folders");
  div.innerHTML="";
  Object.keys(folders).forEach(f=>{
    let card=document.createElement("div");
    card.className="card";
    card.innerHTML=`<h4>${f}</h4>
      <input type="text" placeholder="Add item" id="item-${f}">
      <button onclick="addItem('${f}')">Add Item</button>
      <ul id="list-${f}"></ul>`;
    div.appendChild(card);
// render items
    let ul=document.getElementById(`list-${f}`);
    folders[f].forEach(item=>{
      let li=document.createElement("li");
      li.textContent=item;
      ul.appendChild(li);
    });
  });
}

function addItem(folder){
  let folders=JSON.parse(localStorage.getItem("folders"))||{};
  let input=document.getElementById(`item-${folder}`);
  let item=input.value;
  if(item){
    folders[folder].push(item);
    localStorage.setItem("folders",JSON.stringify(folders));
    loadFolders();
  }
}


// ===== EXPENSE TRACKER =====
function updateTracker(){
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let now=new Date();
  let totals={day:0,week:0,month:0,year:0};

  transactions.forEach(t=>{
    let d=new Date(`${t.date} ${t.time}`);
    let diffDays=(now-d)/(1000*60*60*24);
    if(diffDays<=1) totals.day+=t.amount;
    if(diffDays<=7) totals.week+=t.amount;
    if(diffDays<=30) totals.month+=t.amount;
    if(diffDays<=365) totals.year+=t.amount;
  });

  let goals={
    daily:parseFloat(document.getElementById("goal-daily").value)||0,
    weekly:parseFloat(document.getElementById("goal-weekly").value)||0,
    monthly:parseFloat(document.getElementById("goal-monthly").value)||0,
    yearly:parseFloat(document.getElementById("goal-yearly").value)||0
  };
document.getElementById("bar-daily").style.width=goals.daily?Math.min(100,(totals.day/goals.daily*100))+"%":"0";
  document.getElementById("bar-weekly").style.width=goals.weekly?Math.min(100,(totals.week/goals.weekly*100))+"%":"0";
  document.getElementById("bar-monthly").style.width=goals.monthly?Math.min(100,(totals.month/goals.monthly*100))+"%":"0";
  document.getElementById("bar-yearly").style.width=goals.yearly?Math.min(100,(totals.year/goals.yearly*100))+"%":"0";
}
