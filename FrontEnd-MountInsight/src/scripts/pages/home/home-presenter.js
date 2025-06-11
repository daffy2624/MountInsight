export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    const recommendations = this._getRecommendations();
    const mountains = this._getMountains();
    this.view.renderHero();
    this.view.renderRecommendations(recommendations);
    this.view.renderVideoSection();
    this.view.renderMountainsSection(mountains);
  }

  _getRecommendations() {
    return [
      {
        name: "Gunung Kawi",
        image: "/images/Kawi.png",
        description:
          "Gunung yang cocok untuk pemula dengan jalur yang cukup ramah dan suasana mistis yang khas.",
        link: "#",
      },
      {
        name: "Gunung Semeru",
        image: "/images/semeru.webp",
        description:
          "Gunung tertinggi di Pulau Jawa. Cocok untuk pendaki berpengalaman. Jalur menantang dan indah.",
        link: "#",
      },
      {
        name: "Gunung Rinjani",
        image: "/images/gunung.png",
        description:
          "Gunung eksotis di Lombok dengan pemandangan Danau Segara Anak yang memukau.",
        link: "#",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
        link: "#",
      },
      {
        name: "Gunung Prau",
        image: "/images/Kawi.png",
        description:
          "Gunung pendek favorit pendaki pemula, terkenal dengan bukit teletubbies dan sunrise yang cantik.",
        link: "#",
      },
    ];
  }

  _getMountains() {
    return [
      {
        name: "Gunung Kawi",
        image: "/images/Kawi.png",
        description:
          "Gunung yang cocok untuk pemula dengan jalur yang cukup ramah dan suasana mistis yang khas.",
      },
      {
        name: "Gunung Semeru",
        image: "/images/semeru.webp",
        description:
          "Gunung tertinggi di Pulau Jawa. Cocok untuk pendaki berpengalaman. Jalur menantang dan indah.",
      },
      {
        name: "Gunung Rinjani",
        image: "/images/gunung.png",
        description:
          "Gunung eksotis di Lombok dengan pemandangan Danau Segara Anak yang memukau.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
      {
        name: "Gunung Sindoro",
        image: "/images/bromo.jpg",
        description:
          "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
      },
    ];
  }
}
