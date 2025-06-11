export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      console.log("Logging in:", email, password);

    });
  }
}
