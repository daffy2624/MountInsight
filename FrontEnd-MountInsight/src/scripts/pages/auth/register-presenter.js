export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        termsAgreed: document.getElementById("agreeTerms").checked,
      };

      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      console.log("Registering:", data);

      // TODO: Add registration logic
    });
  }
}
