// Tabs
function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
}

// Initial open
openTab('expenses');

// Generic function to add item
function handleForm(formId, listId, fields) {
  const form = document.getElementById(formId);
  const list = document.getElementById(listId);
  let data = [];

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const values = Array.from(form.elements).filter(el => el.tagName !== 'BUTTON').map(el => el.value);
    const item = {};
    fields.forEach((f, i) => item[f] = values[i]);
    data.push(item);
    renderList();
    form.reset();
  });

  function renderList() {
    list.innerHTML = '';
    data.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${fields.map(f => `<strong>${f}:</strong> ${item[f]}`).join(' | ')}
        <button onclick="deleteItem('${listId}', ${index})">Delete</button>
      `;
      list.appendChild(li);
    });
    window[listId + 'Data'] = data; // store globally for export
  }
}

// Attach forms
handleForm('expense-form', 'expense-list', ['Name', 'Amount']);
handleForm('client-form', 'client-list', ['Name', 'Address', 'Phone', 'Work', 'Status']);
handleForm('vendor-form', 'vendor-list', ['Name', 'Address', 'Phone', 'Service']);
handleForm('contractor-form', 'contractor-list', ['Name', 'Address', 'Phone', 'Service']);

// Delete item
function deleteItem(listId, index) {
  const data = window[listId + 'Data'];
  data.splice(index, 1);
  document.getElementById(listId).innerHTML = '';
  data.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${Object.keys(item).map(k => `<strong>${k}:</strong> ${item[k]}`).join(' | ')}
      <button onclick="deleteItem('${listId}', ${i})">Delete</button>
    `;
    document.getElementById(listId).appendChild(li);
  });
  window[listId + 'Data'] = data;
}

// Export data
function exportData(listName) {
  const data = window[listName + '-listData'];
  if (!data || data.length === 0) {
    alert('No data to export!');
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${listName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
// Tab switching
function openTab(tabName) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach(c => c.style.display = "none");

  document.getElementById(tabName).style.display = "block";
}

// Utility to create list item with delete button
function createListItem(text, listId) {
  const li = document.createElement("li");
  li.textContent = text;

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.onclick = () => li.remove();

  li.appendChild(delBtn);
  document.getElementById(listId).appendChild(li);
}

// Handle form submissions
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  const name = inputs[0].value;
  const amount = inputs[1].value;
  createListItem(`${name} - ₹${amount}`, "expense-list");
  this.reset();
});

document.getElementById("client-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input, select");
  const entry = `${inputs[0].value}, ${inputs[1].value}, ${inputs[2].value}, ${inputs[3].value}, Status: ${inputs[4].value}`;
  createListItem(entry, "client-list");
  this.reset();
});

document.getElementById("vendor-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  const entry = `${inputs[0].value}, ${inputs[1].value}, ${inputs[2].value}, Service: ${inputs[3].value}`;
  createListItem(entry, "vendor-list");
  this.reset();
});

document.getElementById("contractor-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  const entry = `${inputs[0].value}, ${inputs[1].value}, ${inputs[2].value}, Service: ${inputs[3].value}`;
  createListItem(entry, "contractor-list");
  this.reset();
});

// Export data as CSV
function exportData(type) {
  let listId = `${type}-list`;
  const items = document.querySelectorAll(`#${listId} li`);
  if (items.length === 0) {
    alert("No data to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  items.forEach(item => {
    // remove delete button text
    let text = item.textContent.replace("Delete", "").trim();
    csvContent += text + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${type}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Default open Expenses tab
openTab("expenses");

