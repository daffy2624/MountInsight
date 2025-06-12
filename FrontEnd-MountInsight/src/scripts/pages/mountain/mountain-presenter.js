import { getMountainById } from "../../data/api";
import { parseActivePathname } from "../../routes/url-parser";

export default class MountainPresenter {
  constructor(mountainView) {
    this.mountainView = mountainView;
  }

  async init() {
    const { id } = parseActivePathname(); // Ambil ID dari URL

    try {
      const response = await getMountainById(id);

      const mountain = {
        name: response.data.mountain.nama,
        image: `/${response.data.mountain.gambar.replace(/^public\//, "")}`,
        description: response.data.mountain.deskripsi,
      };

      this.mountainView.renderHero(mountain);
      this.mountainView.renderCommentSection();
    } catch (error) {
      alert("Gagal memuat data gunung.");
    }
  }
}
