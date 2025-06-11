export default class ProfilePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async init() {
    const profileData = await this._getProfileData();
    this.view.renderForm(profileData);
    this.view.setupProfilePictureUpload();
    this.setupEditLogic(profileData.id); // kirim ID user untuk update
    this.setupLogout();
  }

  async _getProfileData() {
    try {
      const userId = localStorage.getItem('user_id'); // pastikan user_id disimpan saat login

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
      changePicBtn.disabled = false;
      changePicBtn.classList.remove('disabled');
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
    });

    saveBtn.addEventListener('click', async () => {
      const updatedProfile = {
        id: userId,
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
      };

      try {
        const result = await this.model.updateProfile(updatedProfile);

        if (result.ok) {
          alert('Profil berhasil diperbarui.');
        } else {
          alert('Gagal memperbarui profil.');
        }
      } catch (err) {
        console.error('Gagal update profil:', err);
        alert('Terjadi kesalahan saat memperbarui profil.');
      }

      // Disable kembali input & ubah tombol
      inputs.forEach(input => input.disabled = true);
      changePicBtn.disabled = true;
      changePicBtn.classList.add('disabled');
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user_id');
      window.location.href = '#/login';
    });
  }
}
