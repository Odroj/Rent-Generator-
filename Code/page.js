// Main entry — run after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Grab the form and the preview container
  const form = document.getElementById("receipt-form");
  const previewCard = document.querySelector(".receipt-card");

  // If the page structure is not present, stop silently.
  if (!form || !previewCard) return;

  // Handle form submission: build the receipt preview
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload

    // Read values from the form fields
    const tenant = document.getElementById("tenant-name").value;
    const landlord = document.getElementById("Landlord").value;
    const email = document.getElementById("Useremail").value;
    const phone = document.getElementById("usertele").value;
    const address = document.getElementById("userAddress").value;
    const unit = document.getElementById("user-unit").value;
    const amount = document.getElementById("pay-amt").value;
    const date = document.getElementById("pay-date").value;
    const method = document.getElementById("pay-method").value;
    const receiptID = document.getElementById("rec-ID").value;
    const notes = document.getElementById("notes").value;
    const signature = document.getElementById("signature").value;

    // Ensure amount is displayed with two decimal places
    const parsedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

    // Build simple HTML for the preview card
    const preview = `
      <h3>Rent Receipt</h3>
      <p><strong>Tenant:</strong> ${tenant}</p>
      <p><strong>Landlord:</strong> ${landlord}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Property:</strong> ${address}${unit ? ", Unit " + unit : ""}</p>
      <p><strong>Amount Paid:</strong> $${parsedAmount}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Payment Method:</strong> ${method}</p>
      <p><strong>Receipt ID:</strong> ${receiptID}</p>
      <p><strong>Notes:</strong> ${notes}</p>
      <p><strong>Signature:</strong> ${signature}</p>
    `;

    // Insert the preview into the page
    previewCard.innerHTML = preview;
  });

  // Wire up Print and Save buttons (if present)
  const printBtn = document.getElementById("print-btn");
  const saveBtn = document.getElementById("save-btn");

  if (printBtn) {
    // Opens the print dialog for the current window
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (saveBtn) {
    // Save the preview as a plain text file. Filename uses receipt ID and date when available.
    saveBtn.addEventListener("click", () => {
      const content = previewCard.innerText || ""; // text-only fallback
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const receiptID = document.getElementById("rec-ID")?.value || "receipt";
      const date = document.getElementById("pay-date")?.value || new Date().toISOString().slice(0, 10);
      link.download = `${receiptID}_${date}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // clean up object URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
  }
});
