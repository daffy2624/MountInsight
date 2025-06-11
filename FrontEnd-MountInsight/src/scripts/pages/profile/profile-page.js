import ProfilePresenter from "./profile-presenter";
import ProfileView from "./profile-view";
import * as MountainApi from "../../data/api";

export default class ProfilePage {
  constructor() {
    this.view = new ProfileView();
    this.presenter = new ProfilePresenter(this.view, MountainApi);
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
