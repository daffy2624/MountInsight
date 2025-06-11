import RegisterView from './register-view.js';
import RegisterPresenter from './register-presenter.js';
import * as MountainApi from '../../data/api.js';

export default class RegisterPage {
  constructor() {
    this.view = new RegisterView();
    this.presenter = new RegisterPresenter(this.view, MountainApi);
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
