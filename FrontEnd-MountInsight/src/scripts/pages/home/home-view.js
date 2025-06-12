export default class HomeView {
  getTemplate() {
    return `
      <section id="hero-section" class="hero"></section>
      <section id="recommendation-section"></section>
      <section id="video-section" class="video"></section>
      <section id="mountains-section" class="mountains"></section>
    `;
  }

  renderHero() {
    const section = document.getElementById("hero-section");
    section.innerHTML = `
      <div class="container">
        <h1>Explore The Beauty of Mountains on East Java</h1>
        <div class="form-container">
            <h2>Rekomendasi Gunung</h2>

            <div class="price-range">
                <label class="main-label">Budget</label>
                <div class="range-labels">
                    <span>Rp. 10.000</span>
                    <span>Rp. 100.000</span>
                </div>
                <input type="range" id="priceSlider" min="10000" max="100000" step="5000" value="5000">
                <div id="hargaValue">Rp. 100.000</div>
            </div>

            <div class="difficulty-options">
              <label class="main-label">Kesulitan</label>
              <div class="difficulty-list">
                  <label><input type="radio" name="difficulty" value="mudah"> Mudah</label>
                  <label><input type="radio" name="difficulty" value="sedang"> Sedang</label>
                  <label><input type="radio" name="difficulty" value="sulit"> Sulit</label>
              </div>
            </div>

            <div class="daerah-section">
              <div class="daerah-section-label">
                <label class="main-label">Daerah</label>
              </div>
              <select id="daerah" name="daerah" required>
                  <option value="" disabled selected hidden>Pilih Kota</option>
                  <option value="batu">Batu</option>
                  <option value="banyuwangi">Banyuwangi</option>
                  <option value="blitar">Blitar</option>
                  <option value="bondowoso">Bondowoso</option>
                  <option value="jember">Jember</option>
                  <option value="lumajang">Lumajang</option>
                  <option value="madiun">Madiun</option>
                  <option value="magetan">Magetan</option>
                  <option value="malang">Malang</option>
                  <option value="mojokerto">Mojokerto</option>
                  <option value="pasuruan">Pasuruan</option>
                  <option value="ponorogo">Ponorogo</option>
                  <option value="situbondo">Situbondo</option>
                  <option value="tulungagung">Tulungagung</option>
              </select>
              <button class="btn-cari">
                Cari
              </button>
          </div>
          </div>
        </div>
    </div>
    `;

    const priceSlider = document.getElementById("priceSlider");
    const hargaValue = document.getElementById("hargaValue");

    function updateSliderVisual(value) {
      const min = parseInt(priceSlider.min);
      const max = parseInt(priceSlider.max);
      const val = parseInt(value);
      const percentage = ((val - min) / (max - min)) * 100;

      priceSlider.style.background = `linear-gradient(to right, #f76b1c 0%, #f76b1c ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
      hargaValue.textContent = `Rp. ${value.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
      )}`;
    }

    // Inisialisasi nilai awal
    updateSliderVisual(priceSlider.value);

    // Update saat digeser
    priceSlider.addEventListener("input", (e) => {
      updateSliderVisual(e.target.value);
    });
  }

  showRecommendationError(message) {
    const section = document.getElementById("recommendation-section");
    section.innerHTML = `<p class="error-message">${message}</p>`;
  }

  renderRecommendations(recommendations) {
    // console.log("Recommendation: ", recommendations);
    const section = document.getElementById("recommendation-section");
    section.innerHTML = `
      <div class="mountain-recommendation" id="mountain-section">
        <div class="recommendation-layout">
          <h1>Mountain Recommendation</h1>
          <div class="recomen">
            <button class="carousel-control prev" id="prevSlide">❮</button>

            <div class="recomen-container">
              <div class="recomen-container-inner"></div>
            </div>

            <button class="carousel-control next" id="nextSlide">❯</button>
          </div>
        </div>
      </div>`;

    const container = document.querySelector(".recomen-container-inner");
    container.innerHTML = "";

    // recommendationsData = 

    recommendations.forEach((mountain) => {
      const item = document.createElement("div");

      let gambar = mountain.gambar.replace(/^public\//, "");

      item.classList.add("recomen-item");
      item.innerHTML = `
        <img src="${gambar}" alt="${mountain.nama}" class="image-mountain" />
        <div class="mountain-details">
          <h2>${mountain.nama}</h2>
          <p>${mountain.deskripsi}</p>
          <p>Lokasi Kabupaten: ${mountain.Lokasi_Kabupaten_Utama}</p>
          <p>Budget Rata-rata: ${mountain.Budget_Per_Orang_Rupiah_RataRata}</p>
          <p>Ketinggian ${mountain.Ketinggian_MDPL}</p>
          <p>Durasi Pendakian rata-rata dalam satuan hari: ${mountain.Durasi_Pendakian_Hari_RataRata}</p>
          <a href="/#/mountain/${mountain.id}" class="view-more-btn">View More</a>
        </div>
      `;
      container.appendChild(item);
    });

    this._setupCarousel();
  }

  _setupCarousel() {
    let currentIndex = 0;
    const items = document.querySelectorAll(".recomen-item");
    const totalItems = items.length;
    const containerInner = document.querySelector(".recomen-container-inner");

    function updateCarousel() {
      const offset = -currentIndex * 100;
      containerInner.style.transform = `translateX(${offset}%)`;
    }

    window.moveSlide = function (direction) {
      currentIndex += direction;

      if (currentIndex < 0) {
        currentIndex = totalItems - 1;
      } else if (currentIndex >= totalItems) {
        currentIndex = 0;
      }

      updateCarousel();
    };

    // Optional: Auto-rotate every 5 seconds
    setInterval(() => moveSlide(1), 10000);

    updateCarousel();

    document
      .getElementById("prevSlide")
      .addEventListener("click", () => moveSlide(-1));
    document
      .getElementById("nextSlide")
      .addEventListener("click", () => moveSlide(1));
  }

  renderVideoSection() {
    const section = document.getElementById("video-section");
    section.innerHTML = `
      <div class="video-content">
          <h1>Menjelajahi Keindahan Gunung di Jawa Timur</h1>
          <p>Temukan petualangan tak terlupakan dengan mendaki gunung-gunung terbaik di Jawa Timur. Dari puncak yang menantang hingga pemandangan spektakuler, jelajahi keindahan alam yang tak ada duanya</p>
      </div>
      <div class="video-wrapper">
          <video class="video-player" controls>
              <source src="/images/video.mp4" type="video/mp4">
              Your browser does not support the video tag.
          </video>
      </div>
    `;
  }

  renderMountainsSection(mountains) {
    const section = document.getElementById("mountains-section");

    // Struktur utama section
    section.innerHTML = `
    <h2>Mountains</h2>
    <div class="mountain-card-container"></div>
  `;

    // Container untuk card
    const container = section.querySelector(".mountain-card-container");

    // Render setiap gunung
    mountains.forEach((mountain) => {
      const card = document.createElement("div");
      card.classList.add("mountain-card");

      card.innerHTML = `
      <img src="${mountain.image}" alt="${mountain.name}" class="mountain-image">
      <div class="mountain-content">
        <h3>${mountain.name}</h3>
        <p>${mountain.description}</p>
         <a href="#/mountain/${mountain.id}" class="mountain-btn">View More</a>
      </div>
    `;
      container.appendChild(card);
    });
  }
}
