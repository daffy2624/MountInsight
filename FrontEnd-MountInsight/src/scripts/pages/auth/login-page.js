import LoginPresenter from "./login-presenter";
import LoginView from "./login-view";
import * as MountainApi from "../../data/api" 


export default class LoginPage {
  constructor() {
    this.view = new LoginView();
    this.presenter = new LoginPresenter(this.view, MountainApi);
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    document.querySelector("header").style.display = "none";
    document.querySelector("footer").style.display = "none";

    this.presenter.init();
  }
}
