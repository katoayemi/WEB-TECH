'use strict';

console.log("JS LOADED");

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('studentForm');

  console.log("FORM ELEMENT:", form);

  // Safety check (prevents crashes if HTML ID is wrong)
  if (!form) {
    console.error("❌ studentForm not found in HTML");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("SUBMIT TRIGGERED");

    const nameInput = document.getElementById('name');
    const rollInput = document.getElementById('roll');

    // Extra safety checks
    if (!nameInput || !rollInput) {
      console.error("❌ Name or Roll input not found");
      return;
    }

    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();

    console.log({ name, roll });

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollNumber: roll })
      });

      // Check if response is OK
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      console.log("RESPONSE:", data);

      alert("Student added successfully!");
      form.reset();

    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("Failed to add student. Check console.");
    }

  });

});