import HomePresenter from "./home-presenter";
import HomeView from "./home-view";

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.presenter = new HomePresenter(this.view);
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    document.querySelector("header").style.display = "flex"; // atau ""
    document.querySelector("footer").style.display = "block";

    this.presenter.init();
  }
}
