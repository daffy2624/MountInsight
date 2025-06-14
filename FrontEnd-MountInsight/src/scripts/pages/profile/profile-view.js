export default class ProfileView {
  getTemplate() {
    return `
      <section class="profile-section">
        <div class="profile-container">
          <h1>My Profile</h1>
          <div class="profile-content" id="profile-content">
            
          </div>
        </div>
      </section>
    `;
  }

  renderForm(profile) {
    const {
      nama = '',
      email = '',
      age = '',
      gender = '',
      gambar_profil = ''
    } = profile || {};

    const profileContent = document.getElementById('profile-content');
    if (!profileContent) {
      console.error('Elemen #profile-info tidak ditemukan di DOM!');
      return;
    }

    profileContent.innerHTML = `
    <!-- FOTO PROFIL -->
            <div class="profile-picture">
              <img id="profileImage" src="uploads/${gambar_profil}" alt="Profile Picture" />
              <div class="button-wrapper">
                <input type="file" id="uploadInput" accept="image/*" hidden />
                <button id="changePicBtn" class="change-pic disabled" type="button" disabled>
                  Change Profile Picture
                </button>
              </div>
            </div>

            <!-- FORM PROFIL -->
            <div class="profile-info" id="profile-info">
              <div>
        <label for="name">Name</label>
        <input type="text" id="name" value="${nama}" disabled />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" value="${email}" disabled />
      </div>
      <div>
        <label for="age">Age</label>
        <input type="number" id="age" value="${age}" disabled />
      </div>
        <div>
          <label for="gender">Gender</label>
          <select id="gender" disabled>
            <option value="L" ${gender === 'L' ? 'selected' : ''}>Male</option>
            <option value="P" ${gender === 'P' ? 'selected' : ''}>Female</option>
          </select>
      </div>
      <div class="profile-buttons">
        <div class="left-buttons">
          <button id="editBtn" type="button">Edit Profile</button>
          <button id="saveBtn" type="button" style="display: none;">Save Profile</button>
        </div>
        <div class="right-buttons">
          <button id="logoutBtn" type="button" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>
      
    `;
  }

  setupProfilePictureUpload() {
    const uploadInput = document.getElementById('uploadInput');
    const profileImage = document.getElementById('profileImage');
    const changePicBtn = document.getElementById('changePicBtn');

    if (!uploadInput || !profileImage || !changePicBtn) return;

    changePicBtn.addEventListener('click', () => {
      uploadInput.click();
    });

    uploadInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}