function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');

    document.getElementById(tabName).style.display = 'block';
}

// Show default tab
openTab('expenses');

// Expense Form
document.getElementById('expense-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this[0].value;
    const amount = this[1].value;
    const li = document.createElement('li');
    li.textContent = `${name} - ₹${amount}`;
    document.getElementById('expense-list').appendChild(li);
    this.reset();
});

// Client Form
document.getElementById('client-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this[0].value;
    const address = this[1].value;
    const phone = this[2].value;
    const work = this[3].value;
    const status = this[4].value;
    const li = document.createElement('li');
    li.textContent = `${name} | ${address} | ${phone} | ${work} | ${status}`;
    document.getElementById('client-list').appendChild(li);
    this.reset();
});

// Vendor Form
document.getElementById('vendor-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this[0].value;
    const address = this[1].value;
    const phone = this[2].value;
    const service = this[3].value;
    const li = document.createElement('li');
    li.textContent = `${name} | ${address} | ${phone} | ${service}`;
    document.getElementById('vendor-list').appendChild(li);
    this.reset();
});

// Contractor Form
document.getElementById('contractor-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this[0].value;
    const address = this[1].value;
    const phone = this[2].value;
    const service = this[3].value;
    const li = document.createElement('li');
    li.textContent = `${name} | ${address} | ${phone} | ${service}`;
    document.getElementById('contractor-list').appendChild(li);
    this.reset();
});
