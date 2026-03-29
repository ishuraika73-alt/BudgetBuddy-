// Balance
function saveBalance(){
  let b=document.getElementById("set-balance").value;
  localStorage.setItem("balance", b);
  alert("Balance updated!");
  showScreen("home-screen");
}

// Load Home
function loadHome(){
  let balance=localStorage.getItem("balance")||0;
  document.getElementById("balance").innerText=balance;

  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let recent=transactions.slice(-3).reverse();
  let list=document.getElementById("recent-transactions");
  list.innerHTML="";
  recent.forEach(t=>{
    let li=document.createElement("li");
    li.textContent=`${t.title} - ₹${t.amount} (${t.type}) ${t.important?"⭐":""}`;
    list.appendChild(li);
  });
}
// Add Transaction
function addTransaction(){
  let title=document.getElementById("t-title").value;
  let amount=parseFloat(document.getElementById("t-amount").value);
  let type=document.getElementById("t-type").value;
  let category=document.getElementById("t-category").value;
  let important=document.getElementById("t-important").checked;
  if(!title||!amount){alert("Fill required fields");return;}
  let now=new Date();
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  transactions.push({
    title,amount,type,category,important,
    date:now.toLocaleDateString(),
    time:now.toLocaleTimeString()
  });
  localStorage.setItem("transactions",JSON.stringify(transactions));
  alert("Transaction saved!");
  showScreen("transactions-screen");
  loadTransactions();
}

// Transactions
function loadTransactions(){
  let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let list=document.getElementById("transactions-list");
  list.innerHTML="";
  transactions.slice().reverse().forEach((t,i)=>{
    let li=document.createElement("li");
    li.textContent=`${t.date} ${t.time} | ${t.title} - ₹${t.amount} (${t.type}) ${t.important?"⭐":""}`;
    // toggle important
    let star=document.createElement("button");
    star.textContent="⭐";
    star.className="star";
    star.onclick=()=>{
      transactions[transactions.length-1-i].important=!transactions[transactions.length-1-i].important;
      localStorage.setItem("transactions",JSON.stringify(transactions));
      loadTransactions();
    };
    li.appendChild(star);
    list.appendChild(li);
  });
}

// Important Transactions
function loadImportant(){
let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
  let important=transactions.filter(t=>t.important);
  let list=document.getElementById("important-list");
  list.innerHTML="";
  important.slice().reverse().forEach(t=>{
    let li=document.createElement("li");
    li.textContent=`${t.date} ${t.time} | ${t.title} - ₹${t.amount} (${t.type}) ⭐`;
    list.appendChild(li);
  });
}
function showImportant(){
  showScreen("important-screen");
}

// Expense Tracker
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

  // update bars
  document.getElementById("bar-daily").style.width=goals.daily?Math.min(100,(totals.day/goals.daily*100))+"%":"0";
  document.getElementById("bar-weekly").style.width=goals.weekly?Math.min(100,(totals.week/goals.weekly*100))+"%":"0";
  document.getElementById("bar-monthly").style.width=goals.monthly?Math.min(100,(totals.month/goals.monthly*100))+"%":"0";
  document.getElementById("bar-yearly").style.width=goals.yearly?Math.min(100,(totals.year/goals.yearly*100))+"%":"0";
}
