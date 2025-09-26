// Utility to create list item with delete button (Excel-like grid)
function createListItem(fields, listId) {
  const li = document.createElement("li");

  const container = document.createElement("div");
  container.classList.add("card-box");

  fields.forEach(f => {
    const row = document.createElement("div");
    row.classList.add("field-row");

    const label = document.createElement("div");
    label.classList.add("field-label");
    label.textContent = f.label;

    const value = document.createElement("div");
    value.classList.add("field-value");
    value.textContent = f.value;

    row.appendChild(label);
    row.appendChild(value);
    container.appendChild(row);
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete-btn");
  delBtn.onclick = () => li.remove();
  container.appendChild(delBtn);

  li.appendChild(container);
  document.getElementById(listId).appendChild(li);
}

// Handle form submissions
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  createListItem(
    [
      { label: "Name", value: inputs[0].value },
      { label: "Amount", value: `₹${inputs[1].value}` }
    ],
    "expense-list"
  );
  this.reset();
});

document.getElementById("client-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input, select");
  createListItem(
    [
      { label: "Name", value: inputs[0].value },
      { label: "Address", value: inputs[1].value },
      { label: "Phone", value: inputs[2].value },
      { label: "Work", value: inputs[3].value },
      { label: "Status", value: inputs[4].value }
    ],
    "client-list"
  );
  this.reset();
});

document.getElementById("vendor-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  createListItem(
    [
      { label: "Name", value: inputs[0].value },
      { label: "Address", value: inputs[1].value },
      { label: "Phone", value: inputs[2].value },
      { label: "Service", value: inputs[3].value }
    ],
    "vendor-list"
  );
  this.reset();
});

document.getElementById("contractor-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  createListItem(
    [
      { label: "Name", value: inputs[0].value },
      { label: "Address", value: inputs[1].value },
      { label: "Phone", value: inputs[2].value },
      { label: "Service", value: inputs[3].value }
    ],
    "contractor-list"
  );
  this.reset();
});

// script.js - simple localStorage based portal
const EXP_KEY = 'efs_expenses_v1';
const VENDOR_KEY = 'efs_vendors_v1';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initDefaults();
  bindExpenseForm();
  bindVendorForm();
  renderVendors();
  renderExpenses();
});

// Tabs
function initTabs(){
  const tabExp = document.getElementById('tab-expenses');
  const tabVen = document.getElementById('tab-vendors');
  tabExp.onclick = () => switchSection('expenses');
  tabVen.onclick = () => switchSection('vendors');
}
function switchSection(name){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  if(name==='expenses'){
    document.getElementById('tab-expenses').classList.add('active');
    document.getElementById('section-expenses').classList.add('active');
  } else {
    document.getElementById('tab-vendors').classList.add('active');
    document.getElementById('section-vendors').classList.add('active');
  }
}

// Storage helpers
function getExpenses(){ return JSON.parse(localStorage.getItem(EXP_KEY) || '[]'); }
function saveExpenses(arr){ localStorage.setItem(EXP_KEY, JSON.stringify(arr)); }
function getVendors(){ return JSON.parse(localStorage.getItem(VENDOR_KEY) || '[]'); }
function saveVendors(arr){ localStorage.setItem(VENDOR_KEY, JSON.stringify(arr)); }

// Initialize default date and bind action buttons
function initDefaults(){
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('expense-date').value = today;

  document.getElementById('export-expenses').onclick = exportExpensesCSV;
  document.getElementById('export-vendors').onclick = exportVendorsCSV;
  document.getElementById('clear-expenses').onclick = ()=>{ if(confirm('Clear all expenses?')){ saveExpenses([]); renderExpenses(); }};
  document.getElementById('clear-vendors').onclick = ()=>{ if(confirm('Clear all vendors?')){ saveVendors([]); renderVendors(); }};
}

// Expense form
function bindExpenseForm(){
  const form = document.getElementById('expense-form');
  const cancel = document.getElementById('expense-cancel');
  cancel.onclick = resetExpenseForm;

  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('expense-id').value;
    const date = document.getElementById('expense-date').value;
    let vendor = document.getElementById('expense-vendor').value;
    const vendorFree = document.getElementById('expense-vendor-free').value.trim();
    if(vendorFree) vendor = vendorFree;
    const category = document.getElementById('expense-category').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const desc = document.getElementById('expense-desc').value.trim();

    if(!date || isNaN(amount)){
      alert('Please enter date and valid amount');
      return;
    }

    let expenses = getExpenses();
    if(id){
      // update
      expenses = expenses.map(x => x.id === id ? {...x, date, vendor, category, amount, desc} : x);
    } else {
      expenses.push({ id: Date.now().toString(), date, vendor, category, amount, desc });
    }
    saveExpenses(expenses);
    renderExpenses();
    resetExpenseForm();
  };
}

// Vendor form
function bindVendorForm(){
  const form = document.getElementById('vendor-form');
  const cancel = document.getElementById('vendor-cancel');
  cancel.onclick = resetVendorForm;

  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('vendor-id').value;
    const name = document.getElementById('vendor-name').value.trim();
    const contact = document.getElementById('vendor-contact').value.trim();
    const service = document.getElementById('vendor-service').value.trim();
    const email = document.getElementById('vendor-email').value.trim();
    if(!name){ alert('Vendor name required'); return; }

    let vendors = getVendors();
    if(id){
      vendors = vendors.map(v => v.id === id ? {...v, name, contact, service, email} : v);
    } else {
      vendors.push({ id: Date.now().toString(), name, contact, service, email });
    }
    saveVendors(vendors);
    renderVendors();
    resetVendorForm();
  };
}

// Render vendors list and vendor select for expenses
function renderVendors(){
  const tbody = document.querySelector('#vendors-table tbody');
  tbody.innerHTML = '';
  const vendors = getVendors();
  vendors.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(v.name)}</td><td>${escapeHtml(v.contact)}</td><td>${escapeHtml(v.service)}</td><td>${escapeHtml(v.email)}</td>
      <td>
        <button onclick="editVendor('${v.id}')">Edit</button>
        <button onclick="deleteVendor('${v.id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  // populate vendor select
  const sel = document.getElementById('expense-vendor');
  sel.innerHTML = '<option value="">-- Select vendor (or enter name) --</option>';
  vendors.forEach(v=>{
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = v.name;
    sel.appendChild(opt);
  });
}

function editVendor(id){
  const v = getVendors().find(x=>x.id===id);
  if(!v) return alert('Vendor not found');
  document.getElementById('vendor-id').value = v.id;
  document.getElementById('vendor-name').value = v.name;
  document.getElementById('vendor-contact').value = v.contact;
  document.getElementById('vendor-service').value = v.service;
  document.getElementById('vendor-email').value = v.email;
  document.getElementById('vendor-form-title').textContent = 'Edit Vendor';
}

function deleteVendor(id){
  if(!confirm('Delete vendor?')) return;
  const vendors = getVendors().filter(x=>x.id!==id);
  saveVendors(vendors);
  renderVendors();
}

// Render expenses
function renderExpenses(){
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';
  const expenses = getExpenses().sort((a,b)=> new Date(b.date) - new Date(a.date));
  let total = 0;
  expenses.forEach(exp => {
    total += Number(exp.amount || 0);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(exp.date)}</td>
      <td>${escapeHtml(exp.vendor || '')}</td>
      <td>${escapeHtml(exp.category || '')}</td>
      <td>${escapeHtml(exp.desc || '')}</td>
      <td>${Number(exp.amount).toFixed(2)}</td>
      <td>
        <button onclick="editExpense('${exp.id}')">Edit</button>
        <button onclick="deleteExpense('${exp.id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('expenses-total').textContent = total.toFixed(2);
}

// Edit / Delete expenses
function editExpense(id){
  const e = getExpenses().find(x=>x.id===id);
  if(!e) return alert('Expense not found');
  document.getElementById('expense-id').value = e.id;
  document.getElementById('expense-date').value = e.date;
  // Try to select vendor in select; otherwise fill free input
  const sel = document.getElementById('expense-vendor');
  let found = false;
  for(let i=0;i<sel.options.length;i++){
    if(sel.options[i].value === e.vendor){ sel.selectedIndex = i; found = true; break; }
  }
  document.getElementById('expense-vendor-free').value = found ? '' : (e.vendor || '');
  document.getElementById('expense-category').value = e.category || '';
  document.getElementById('expense-amount').value = Number(e.amount).toFixed(2);
  document.getElementById('expense-desc').value = e.desc || '';
  document.getElementById('expense-form-title').textContent = 'Edit Expense';
}

function deleteExpense(id){
  if(!confirm('Delete expense?')) return;
  const arr = getExpenses().filter(x=>x.id!==id);
  saveExpenses(arr);
  renderExpenses();
}

function resetExpenseForm(){
  document.getElementById('expense-id').value = '';
  document.getElementById('expense-form').reset();
  document.getElementById('expense-vendor-free').value = '';
  document.getElementById('expense-form-title').textContent = 'Add Expense';
  document.getElementById('expense-date').value = new Date().toISOString().slice(0,10);
}
function resetVendorForm(){
  document.getElementById('vendor-id').value = '';
  document.getElementById('vendor-form').reset();
  document.getElementById('vendor-form-title').textContent = 'Add Vendor';
}

// CSV export
function exportExpensesCSV(){
  const rows = getExpenses();
  if(!rows.length){ alert('No expenses to export'); return; }
  const header = ['Date','Vendor','Category','Description','Amount'];
  let csv = header.join(',') + '\n';
  rows.forEach(r=>{
    csv += `${escapeCSV(r.date)},${escapeCSV(r.vendor)},${escapeCSV(r.category)},${escapeCSV(r.desc)},${r.amount}\n`;
  });
  downloadFile(csv, 'expenses.csv','text/csv');
}
function exportVendorsCSV(){
  const rows = getVendors();
  if(!rows.length){ alert('No vendors to export'); return; }
  const header = ['Name','Contact','Service','Email'];
  let csv = header.join(',') + '\n';
  rows.forEach(r=>{
    csv += `${escapeCSV(r.name)},${escapeCSV(r.contact)},${escapeCSV(r.service)},${escapeCSV(r.email)}\n`;
  });
  downloadFile(csv, 'vendors.csv','text/csv');
}
function downloadFile(content, filename, type){
  const a = document.createElement('a');
  const blob = new Blob([content], {type});
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// small helpers
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }
function escapeCSV(s){ if(s==null) return ''; return `"${String(s).replace(/"/g,'""')}"`; }
