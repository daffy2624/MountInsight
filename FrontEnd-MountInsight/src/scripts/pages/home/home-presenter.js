import { getRecommendation, getAllMountains } from "../../data/api";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    // const recommendations = this._getRecommendations();
    const mountains = await this._getMountains();

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

  async _getMountains() {
    const response = await getAllMountains();

    if (!response.ok) {
      this.view.showRecommendationError?.(
        response.message || "Gagal memuat data gunung."
      );
      return [];
    }

    // Format data supaya cocok dengan view (nama -> name, gambar -> image, deskripsi -> description)
    return response.data.mountains.map((mountain) => ({
      name: mountain.nama,
      image: mountain.gambar,
      description: mountain.deskripsi,
    }));
  }
}
