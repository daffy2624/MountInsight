import { getRecommendation, getAllMountains, getMountainByName } from "../../data/api";

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

    return response.recommendations || []; // Pastikan kamu return array untuk view
  }

  async _getDatabaseRecommendation(mountainName) {

    const response = await getMountainByName(mountainName);

    // console.log("Response: ", response);
    if (!response || !response.mountain) {
      this.view.showRecommendationError?.(
        response.error || "Terjadi kesalahan."
      );
      return [];
    }
   
    return response.mountain || []; // Pastikan kamu return array untuk view
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

      const combinedData = await this._getAllDatabaseRecommendations(recommendations);

      // console.log("Recommendation from Database: ", combinedData);


      // console.log("Recommendations: ", recommendations);
      this.view.renderRecommendations(combinedData);
    });
  }

  async _getAllDatabaseRecommendations(recommendations) {
    const results = [];
  
    for (const rec of recommendations) {
      try {
        const data = await this._getDatabaseRecommendation(rec.Nama_Gunung);
        if (data) {
          // Gabungkan data ML dan data DB jadi satu objek
          results.push({
            ...rec,        // data dari ML
            ...data        // data dari database (nama, deskripsi, gambar)
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data untuk:", rec.Nama_Gunung, err.message);
      }
    }
  
    return results;
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
      id: mountain.id,
      name: mountain.nama,
      image: `/${mountain.gambar.replace(/^public\//, "")}`,
      description: mountain.deskripsi,
    }));
  }
}
