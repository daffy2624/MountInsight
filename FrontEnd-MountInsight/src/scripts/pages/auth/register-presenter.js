export default class RegisterPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value,
        age: parseInt(document.getElementById("age").value, 10),
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      if (!data.name || !data.age || !data.gender || !data.email || !data.password) {
        alert("Semua field wajib diisi.");
        return;
      }

      try {
        const response = await this.model.getRegister({
          name: data.name,
          age: data.age,
          gender: data.gender,
          email: data.email,
          password: data.password,
        });

        if (response.ok) {
          alert("Registrasi berhasil! Silakan login.");
          window.location.href = "#/login";
        } else {
          alert(`Registrasi gagal: ${response.message || "Terjadi kesalahan."}`);
        }
      } catch (error) {
        console.error("Error saat registrasi:", error);
        alert("Terjadi kesalahan saat registrasi.");
      }
    });
  }
}
