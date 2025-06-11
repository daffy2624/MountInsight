import { getRecommendation } from "../../data/api";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    // const recommendations = this._getRecommendations();
    const mountains = this._getMountains();

    this.view.renderHero();
    this._setupRecommendationForm();

    // this.view.renderRecommendations(recommendations);
    this.view.renderVideoSection();
    this.view.renderMountainsSection(mountains);
  }

  async _getRecommendation(requestData) {
    const response = await getRecommendation(requestData);

    if (!response.ok) {
      this.view.showRecommendationError?.(
        response.error || "Terjadi kesalahan."
      );
      return [];
    }

    return response.data || []; // Pastikan kamu return array untuk view
  }

  _setupRecommendationForm() {
    const cariButton = document.querySelector(".btn-cari");

    cariButton?.addEventListener("click", async (event) => {
      event.preventDefault();

      // Ambil data dari form
      const daerahSelect = document.getElementById("daerah");
      const budgetSlider = document.getElementById("priceSlider");
      const difficultyRadios = document.querySelectorAll(
        "input[name='difficulty']"
      );
      const selectedDifficulty = [...difficultyRadios]
        .find((r) => r.checked)
        ?.value?.toLowerCase();

      // Validasi input
      if (!daerahSelect.value || !selectedDifficulty) {
        alert("Mohon lengkapi pilihan daerah dan tingkat kesulitan.");
        return;
      }

      // Bentuk objek request sesuai backend FastAPI
      const requestData = {
        lokasi: daerahSelect.value,
        budget: parseInt(budgetSlider.value),
        tingkat_kesulitan: selectedDifficulty, // harus lowercase: mudah/sedang/sulit
        cocok_pemula: "Ya", // bisa kamu ubah nanti jika mau dari user
        fasilitas_basecamp: "", // bisa juga disesuaikan dari form tambahan
        // num_recommendations: 5,
      };

      // Ambil rekomendasi dari backend
      const recommendations = await this._getRecommendation(requestData);
      this.view.renderRecommendations(recommendations);
    });
  }

  // _getRecommendations() {
  //   return [
  //     {
  //       name: "Gunung Kawi",
  //       image: "/images/Kawi.png",
  //       description:
  //         "Gunung yang cocok untuk pemula dengan jalur yang cukup ramah dan suasana mistis yang khas.",
  //       link: "#",
  //     },
  //     {
  //       name: "Gunung Semeru",
  //       image: "/images/semeru.webp",
  //       description:
  //         "Gunung tertinggi di Pulau Jawa. Cocok untuk pendaki berpengalaman. Jalur menantang dan indah.",
  //       link: "#",
  //     },
  //     {
  //       name: "Gunung Rinjani",
  //       image: "/images/gunung.png",
  //       description:
  //         "Gunung eksotis di Lombok dengan pemandangan Danau Segara Anak yang memukau.",
  //       link: "#",
  //     },
  //     {
  //       name: "Gunung Sindoro",
  //       image: "/images/bromo.jpg",
  //       description:
  //         "Gunung di Jawa Tengah yang terkenal dengan sunrise-nya. Jalurnya cukup menanjak tapi bersahabat.",
  //       link: "#",
  //     },
  //     {
  //       name: "Gunung Prau",
  //       image: "/images/Kawi.png",
  //       description:
  //         "Gunung pendek favorit pendaki pemula, terkenal dengan bukit teletubbies dan sunrise yang cantik.",
  //       link: "#",
  //     },
  //   ];
  // }

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
