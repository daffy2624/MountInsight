export default class MountainPresenter {
  constructor(mountainView) {
    this.mountainView = mountainView;
  }

  init() {
    const mountainId = 1
    const mountainData = this._getMountainData(mountainId);

    this.mountainView.renderHero(mountainData);
    this.mountainView.renderCommentSection();
  }

  _getMountainData(id) {
    return {
      id: id,
      name: "Gunung Kawi",
      image: "/images/Kawi.png",
      description: "Gunung yang cocok untuk pemula dengan jalur yang cukup ramah dan suasana mistis yang khas.",
      height: "2,651 m",
      location: "Malang, Jawa Timur",
      difficulty: "Mudah",
      bestTimeToVisit: "April - Oktober",
      tips: [
        "Bawa air minum yang cukup.",
        "Gunakan sepatu trekking yang nyaman.",
        "Jaga kebersihan jalur pendakian."
      ]
    };
  }
}
