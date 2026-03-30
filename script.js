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

// Notes / Folders
function addFolder(){
  let folder=document.getElementById("note-folder").value;
  if(!folder){alert("Enter folder name");return;}
  let folders=JSON.parse(localStorage.getItem("folders"))||[];
  if(!folders.includes(folder)) folders.push(folder);
  localStorage.setItem("folders",JSON.stringify(folders));
  loadFolders();
}
function loadFolders(){
  let folders=JSON.parse(localStorage.getItem("folders"))||[];
  let div=document.getElementById("folders");
  div.innerHTML="";
  folders.forEach(f=>{
    let card=document.createElement("div");
    card.className="card";
    card.textContent=f;
    div.appendChild(card);
  });
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

  document.getElementById("bar-daily").style.width=goals.daily?Math.min(100,(totals.day/goals.daily*100))+"%":"0";
  document.getElementById("bar-weekly").style.width=goals.weekly?Math.min(100,(totals.week/goals.weekly*100))+"%":"0";
  document.getElementById("bar-monthly").style.width=goals.monthly?Math.min(100,(totals.month/goals.monthly*100))+"%":"0";
  document.getElementById("bar-yearly").style.width=goals.yearly?Math.min(100,(totals.year/goals.yearly*100))+"%":"0";
}
