import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
    this._setupDrawer();
  }

  _setupDrawer() {
    window.addEventListener("scroll", function () {
      const header = document.querySelector("header");

      if (window.scrollY > 0) {
        header.classList.add("scrolled"); // Menambahkan background saat di-scroll
      } else {
        header.classList.remove("scrolled"); // Menghapus background saat di atas
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // Cek apakah user sudah login
    const userId = localStorage.getItem("userId");
    const isLoginPage = url === "/login" || url === "/register";

    if (!userId && !isLoginPage) {
      window.location.hash = "#/login";
      return;
    }

    if (!page) return;

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
