import ProfilePresenter from "./profile-presenter";
import ProfileView from "./profile-view";
import * as MountainApi from "../../data/api";

export default class ProfilePage {
  constructor() {
    this.view = null;
    this.presenter = null;
  }

  async render() {
    this.view = new ProfileView();
    return this.view.getTemplate();
  }

  async afterRender() {
    console.log("✅ afterRender jalan");
    document.querySelector("header").style.display = "flex"; // atau ""
    document.querySelector("footer").style.display = "block";
    
    this.presenter = new ProfilePresenter(this.view, MountainApi);
    setTimeout(() => {
      console.log("✅ Memanggil presenter.init()");
      this.presenter.init();
    }, 0);
  }
}
