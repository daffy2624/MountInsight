export default class ProfilePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async init() {
    const profileData = await this._getProfileData();
    const userId = localStorage.getItem('userId');
    if (!profileData || !profileData.nama) return;

    requestAnimationFrame(() => {
      this.view.renderForm(profileData);
      this.view.setupProfilePictureUpload();
      this.setupEditLogic(userId);
      this.setupLogout();
    });
  }

  async _getProfileData() {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) throw new Error('User ID tidak ditemukan di localStorage.');

      const response = await this.model.getProfileById(userId);
      if (response.ok && response.data?.profile) {
        return response.data.profile;
      } else {
        console.warn('Data profil kosong atau tidak ditemukan.');
        return {};
      }
    } catch (error) {
      console.error('Gagal mengambil data profil:', error);
      return {};
    }
  }

  setupEditLogic(userId) {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const changePicBtn = document.getElementById('changePicBtn');
    const inputs = document.querySelectorAll('.profile-info input, .profile-info select');

    if (!editBtn || !saveBtn) return;

    editBtn.addEventListener('click', () => {
      inputs.forEach(input => input.disabled = false);
      if (changePicBtn) {
        changePicBtn.disabled = false;
        changePicBtn.classList.remove('disabled');
      }
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
    });

    saveBtn.addEventListener('click', async () => {
      const name = document.getElementById('name')?.value?.trim() || null;
      const age = document.getElementById('age')?.value || null;
      const gender = document.getElementById('gender')?.value || null;
      const fileInput = document.getElementById('uploadInput');
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append('id', userId ?? null);
      formData.append('name', name);
      formData.append('age', age);
      formData.append('gender', gender);
      if (file) {
        formData.append('gambar_profil', file); // kirim file kalau ada
      }

      console.log('Updated profile data before sending:', formData);

      try {
        const result = await this.model.updateProfile({ id: userId, formData });
        if (result.ok) {
          alert('Profil berhasil diperbarui.');
        } else {
          alert('Gagal memperbarui profil.');
        }
      } catch (err) {
        console.error('Gagal update profil:', err);
        alert('Terjadi kesalahan saat memperbarui profil.');
      }

      inputs.forEach(input => input.disabled = true);
      if (changePicBtn) {
        changePicBtn.disabled = true;
        changePicBtn.classList.add('disabled');
      }
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userProfile');
      window.location.href = '#/login';
    });
  }
}