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
                    <span>Rp. 100.000</span>
                    <span>Rp. 1.200.000</span>
                </div>
                <input type="range" id="priceSlider" min="100000" max="1200000" step="10000" value="10000">
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
                  <option value="malang">Malang</option>
                  <option value="rinjani">Gunung Rinjani</option>
                  <option value="semeru">Gunung Semeru</option>
              </select>
              <button class="btn-cari">Cari</button>
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
    const section = document.getElementById("recommendation-section");
    section.innerHTML = `
      <div class="mountain-recommendation">
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

    recommendations.forEach((mountain) => {
      const item = document.createElement("div");
      item.classList.add("recomen-item");
      item.innerHTML = `
        <img src="${mountain.image}" alt="${mountain.name}" class="image-mountain" />
        <div class="mountain-details">
          <h2>${mountain.name}</h2>
          <p>${mountain.description}</p>
          <a href="${mountain.link}" class="view-more-btn">View More</a>
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
        <button class="mountain-btn">View More</button>
      </div>
    `;

      container.appendChild(card);
    });

    // Event listener untuk klik kartu
    const mountainCards = document.querySelectorAll(".mountain-card");
    mountainCards.forEach((card) => {
      card.addEventListener("click", () => {
        const name = card.querySelector("h3").textContent;
        alert(`You clicked on ${name}`);
      });
    });
  }
}
