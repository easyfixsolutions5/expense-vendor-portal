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
