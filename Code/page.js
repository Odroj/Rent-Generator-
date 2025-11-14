document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("receipt-form");
  const previewCard = document.getElementById("receipt-history");
  const printBtn = document.getElementById("print-btn");
  const saveBtn = document.getElementById("save-btn");
  const clearAllBtn = document.getElementById("clear-all-btn");

  const STORAGE_KEY = "receipts";

  function readReceipts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveReceipts(receipts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }

  function renderReceiptPreview(receipt) {
    return `
      <div class="receipt-entry">
        <h3>Rent Receipt</h3>
        <p><strong>Tenant:</strong> ${receipt.tenant}</p>
        <p><strong>Landlord:</strong> ${receipt.landlord}</p>
        <p><strong>Email:</strong> ${receipt.email}</p>
        <p><strong>Phone:</strong> ${receipt.phone}</p>
        <p><strong>Property:</strong> ${receipt.address}${receipt.unit ? ", Unit " + receipt.unit : ""}</p>
        <p><strong>Amount Paid:</strong> $${parseFloat(receipt.amount).toFixed(2)}</p>
        <p><strong>Date:</strong> ${receipt.date}</p>
        <p><strong>Payment Method:</strong> ${receipt.method}</p>
        <p><strong>Receipt ID:</strong> ${receipt.receiptID}</p>
        <p><strong>Notes:</strong> ${receipt.notes}</p>
        <p><strong>Signature:</strong> ${receipt.signature}</p>
        <button class="delete-btn" data-id="${receipt.receiptID}">🗑 Delete</button>
      </div>
    `;
  }

  function renderHistory() {
    const receipts = readReceipts();
    previewCard.innerHTML = receipts.length
      ? receipts.map(renderReceiptPreview).join("")
      : `<p id="preview-placeholder">No receipts saved yet.</p>`;
  }

  function handleDelete(receiptID) {
    const receipts = readReceipts().filter(r => r.receiptID !== receiptID);
    saveReceipts(receipts);
    renderHistory();
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const receipt = {
      tenant: document.getElementById("tenant-name").value,
      landlord: document.getElementById("landlord").value,
      email: document.getElementById("useremail").value,
      phone: document.getElementById("usertele").value,
      address: document.getElementById("userAddress").value,
      unit: document.getElementById("user-unit").value,
      amount: document.getElementById("pay-amt").value,
      date: document.getElementById("pay-date").value,
      method: document.getElementById("pay-method").value,
      receiptID: document.getElementById("rec-ID").value,
      notes: document.getElementById("notes").value,
      signature: document.getElementById("signature").value,
    };

    const receipts = readReceipts();
    receipts.push(receipt);
    saveReceipts(receipts);
    renderHistory();
  }

  function handleSave() {
    const content = previewCard.innerText || "";
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Rent_Receipts_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function handleClearAll() {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }

  // Event bindings
  form?.addEventListener("submit", handleFormSubmit);
  printBtn?.addEventListener("click", () => window.print());
  saveBtn?.addEventListener("click", handleSave);
  clearAllBtn?.addEventListener("click", handleClearAll);

  previewCard.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      handleDelete(id);
    }
  });

  renderHistory();
});


