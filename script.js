let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let savings = parseFloat(localStorage.getItem("savings") || "0");

function update() {
  let balance = 0;
  let list = document.getElementById("list");
  if (list) list.innerHTML = "";

  [...transactions].reverse().forEach((tx, index) => {
    if (!list) return;
    let li = document.createElement("li");
    li.innerHTML = `${tx.date} - ${tx.title} - ${tx.amount.toLocaleString()} Ft [${tx.category}]
      <br><button onclick="remove(${transactions.length - 1 - index})">Törlés</button>`;
    list.appendChild(li);

    if (["Fizetés", "Gift"].includes(tx.category)) {
      balance += tx.amount;
    } else if (["Berakás"].includes(tx.category)) {
      balance -= tx.amount;
      savings += tx.amount;
    } else if (["Kivétel", "Kp ki"].includes(tx.category)) {
      savings -= tx.amount;
    } else if (["Kp be"].includes(tx.category)) {
      savings += tx.amount;
    } else {
      balance -= tx.amount;
    }
  });

  const balanceEl = document.getElementById("balance");
  const savingsEl = document.getElementById("savings");
  if (balanceEl) balanceEl.innerText = balance.toLocaleString();
  if (savingsEl) savingsEl.innerText = savings.toLocaleString();
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("savings", savings.toString());
}

function add() {
  let title = document.getElementById("title").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;

  if (!title || isNaN(amount) || !date) {
    alert("Tölts ki minden mezőt!");
    return;
  }

  transactions.push({ title, amount, date, category });
  update();
}


function remove(index) {
  const tx = transactions[index];
  if (["Berakás"].includes(tx.category)) {
    savings -= tx.amount;
  } else if (["Kivétel", "Kp ki"].includes(tx.category)) {
    savings += tx.amount;
  } else if (["Kp be"].includes(tx.category)) {
    savings -= tx.amount;
  }
  transactions.splice(index, 1);
  update();
}


update();