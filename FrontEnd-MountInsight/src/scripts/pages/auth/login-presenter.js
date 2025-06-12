export default class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      console.log("Logging in:", email, password);

      try {
        const response = await this.model.getLogin({ email, password });

        if (response.ok) {
          console.log("Login berhasil:", response);
          console.log("Full login response:", response);
          
          // Simpan userId atau seluruh data user ke localStorage
          const userId = response.data?.profile?.id; // pastikan `id` memang dikembalikan dari backend
          if (userId) {
            localStorage.setItem("userId", userId); // simpan userId
            // Jika ingin simpan semua data user:
            // localStorage.setItem("user", JSON.stringify(response.data));
          }
          console.log("User ID dari response:", userId);

          window.location.href = "#/"; // arahkan ke halaman berikutnya
        } else {
          alert("Login gagal: " + response.message);
        }
      } catch (error) {
        console.error("Error saat login:", error);
        alert("Terjadi kesalahan saat login.");
      }
    });
  }
}

