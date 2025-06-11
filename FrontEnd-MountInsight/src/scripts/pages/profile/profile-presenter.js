export default class ProfilePresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const profileData = await this._getProfileData(); // Simulated or from storage/API
    this.view.renderForm(profileData);
    this.view.setupProfilePictureUpload();
    this.setupEditLogic();
    this.setupLogout();
  }

  async _getProfileData() {
    return {
      name: 'Awe',
      email: 'awe1234@gmail.com',
      age: 19,
      gender: 'Female',
      birthdate: '2005-01-01',
      phone: '+628123456789'
    };
  }

  setupEditLogic() {
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

    saveBtn.addEventListener('click', () => {
      const updatedProfile = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        birthdate: document.getElementById('birthdate').value,
        phone: document.getElementById('phone').value,
        profileImage: document.getElementById('profileImage').src
      };

      console.log('Saved Profile:', updatedProfile);

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
    // Hapus token/login dari localStorage atau sessionStorage jika ada
    localStorage.removeItem('userToken'); // atau sesuai penyimpanan kamu

    // Redirect ke halaman login
    window.location.href = '#/login'; // asumsi kamu pakai hash router
  });
}

}
