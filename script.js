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
