document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (!termsAccepted) {
    alert("Please accept the Terms and Conditions.");
    return;
    }

    alert("🎉 Registration Successfully!\n\n" +
    "Name: " + fullName +
    "\nEmail: " + email +
    "\nPassword: " + password +
    "\nPhone: " + phone +
    "\nGender: " + gender +
    "\nDOB: " + dob +
    "\nCourse: " + course);
});
