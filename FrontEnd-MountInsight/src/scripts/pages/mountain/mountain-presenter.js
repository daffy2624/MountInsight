import { parseActivePathname } from '../../routes/url-parser';

export default class MountainPresenter {
  constructor(mountainView, model) {
    this.mountainView = mountainView;
    this.model = model;
    this._comments = {}; // Simpan komentar per ID gunung
  }

  async init() {
    try {
      const mountainId = this._extractMountainIdFromUrl();

      if (!mountainId) {
        throw new Error("ID gunung tidak ditemukan di URL");
      }

      const mountainData = await this.model.getMountainById(mountainId);

      this.mountainView.renderHero(mountainData);
      this.mountainView.renderCommentSection(mountainId, this._comments[mountainId] || []);

      this._setupCommentHandler(mountainId);
    } catch (error) {
      console.error("Gagal mengambil data gunung:", error);
      if (typeof this.mountainView.renderError === 'function') {
        this.mountainView.renderError(error.message);
      }
    }
  }

  _extractMountainIdFromUrl() {
    const { id } = parseActivePathname();
    return id || null;
  }

  _setupCommentHandler(mountainId) {
    const postButton = document.getElementById("postButton");
    const commentInput = document.getElementById("commentInput");

    if (!postButton || !commentInput) return;

    postButton.addEventListener("click", () => {
      const text = commentInput.value.trim();
      if (!text) return;

      const now = new Date();
      const newComment = {
        user: "You",
        time: now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: text,
      };

      // Simpan komentar ke array
      if (!this._comments[mountainId]) {
        this._comments[mountainId] = [];
      }
      this._comments[mountainId].unshift(newComment); // Simpan terbaru di atas

      commentInput.value = ""; // Kosongkan input
      this.mountainView.renderCommentSection(mountainId, this._comments[mountainId]); // Re-render
      this._setupCommentHandler(mountainId); // Re-attach event listener
    });
  }
}
