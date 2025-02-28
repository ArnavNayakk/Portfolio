document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Collect form inputs
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Email validation
  const emailError = document.getElementById('emailError');
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailPattern.test(email)) {
    emailError.textContent = "Please enter a valid email ending with @gmail.com";
    return;
  } else {
    emailError.textContent = "";
  }

  try {
    const response = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, subject, message })
    });

    const result = await response.json();
    if (response.status === 201) {
      alert("✅ Message sent successfully!");
      document.getElementById('contactForm').reset();
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (error) {
    console.error("❌ Submission Error:", error);
    alert("Something went wrong! Please try again.");
  }
});
