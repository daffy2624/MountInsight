import MountainPresenter from "./mountain-presenter";
import MountainView from "./mountain-view"

export default class MountainPage {
  constructor() {
    this.view = new MountainView();
    this.presenter = new MountainPresenter(this.view);
  }


  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter.init();
  }
}
