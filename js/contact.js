// Initialize EmailJS - OLD SYNTAX (More Compatible)
(function() {
    emailjs.init("MVSYJAer6FyP9t3zO");
})();

// Helper: email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: show message
function showMessage(element, customMessage = null, duration = 5000) {
    if (customMessage) {
        element.innerHTML = customMessage;
    }
    element.style.display = "block";
    
    // Return a promise that resolves when message is hidden
    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.display = "none";
            resolve();
        }, duration);
    });
}

// Reset button state
function resetButton(button) {
    button.disabled = false;
    button.textContent = "Submit";
}

// Format time remaining
function formatTimeRemaining(milliseconds) {
    const minutes = Math.ceil(milliseconds / 60000);
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
}

// Main send email function
function sendEmail() {
    const emailInput = document.getElementById("Email");
    const nameInput = document.getElementById("Name");
    const successMsg = document.getElementById("successMessage");
    const errorMsg = document.getElementById("errorMessage");
    const button = document.querySelector("button[type='submit']");

    const email = emailInput.value.trim();
    const name = nameInput.value.trim();

    // Reset messages
    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    // Basic validation
    if (!email || !name) {
        showMessage(errorMsg, "❌ Please fill in all fields.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(errorMsg, "❌ Please enter a valid email address.");
        return;
    }

    // 30-minute spam protection
    const lastSent = localStorage.getItem("lastEmailSent");
    const now = Date.now();
    const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (lastSent) {
        const timeSinceLastSent = now - parseInt(lastSent);
        if (timeSinceLastSent < cooldown) {
            const timeRemaining = cooldown - timeSinceLastSent;
            const formattedTime = formatTimeRemaining(timeRemaining);
            showMessage(errorMsg, `❌ Please wait ${formattedTime} before sending another message.`);
            return;
        }
    }

    // Button loading state
    button.disabled = true;
    button.textContent = "Sending...";

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
        showMessage(errorMsg, "❌ Request timed out. Please try again.").then(() => {
            resetButton(button);
        });
    }, 10000);

    console.log("Sending email with data:", {
        from_email: email,
        from_name: name
    });

    // Send email using emailjs.send
    emailjs.send(
        "service_5aovp7m",
        "template_58qu77b",
        {
            from_email: email,
            from_name: name
        }
    ).then(function(response) {
        clearTimeout(safetyTimeout);
        console.log("✅ SUCCESS!", response.status, response.text);
        
        // Save timestamp for spam protection
        localStorage.setItem("lastEmailSent", now.toString());

        // Clear inputs
        emailInput.value = "";
        nameInput.value = "";

        // Show success message and keep button disabled until message disappears
        button.textContent = "Sent!";
        showMessage(successMsg, "✅ Thank you! Your message has been sent successfully.").then(() => {
            resetButton(button);
        });

    }, function(error) {
        clearTimeout(safetyTimeout);
        console.error("❌ FAILED:", error);
        
        // Show error message and keep button disabled until message disappears
        showMessage(errorMsg, "❌ Failed to send email. Please try again.").then(() => {
            resetButton(button);
        });
    });
}