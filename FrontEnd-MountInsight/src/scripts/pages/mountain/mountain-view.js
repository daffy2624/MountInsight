export default class MountainView {
  getTemplate() {
    return `
      <section id="mountain-hero" class="mountain-hero"></section>
      <section class="comments-section" id="comment-section"></section>
    `;
  }

  renderHero(mountain) {
    const section = document.getElementById("mountain-hero");
    section.innerHTML = `
      <div class="image-container">
        <img src="${mountain.image}" alt="${mountain.name}" class="mountain-image">
        <h1>${mountain.name}</h1>
      </div>
      <div class="mountain content">
        <div class="mountain-intro">
          <p>Gunung Kawi adalah gunung yang terletak di perbatasan antara Jawa Timur dan Jawa Tengah, terkenal dengan keindahan alam dan nilai mistisnya.</p>
          <p>Terletak di Kecamatan Wonosari, Kabupaten Malang, Jawa Timur.</p>
        </div>
      </div>
    `;
  }

  renderCommentSection() {
    const section = document.getElementById("comment-section");
    section.innerHTML = `
      <div class="comments-header">
        <h3>Comments</h3>
        <div class="comment-form">
          <textarea placeholder="Write yours here..." class="comment-input" id="commentInput"></textarea>
          <div class="form-actions">
            <button class="post-button" id="postButton">Post</button>
          </div>
        </div>
      </div>

      <div class="comments-list" id="commentsList">
        <!-- Comments will be inserted here -->
      </div>
    `;

    // Attach event listener after rendering
    const postButton = document.getElementById("postButton");
    const commentInput = document.getElementById("commentInput");

    postButton.addEventListener("click", () => {
      const commentText = commentInput.value.trim();
      if (commentText) {
        this._addComment(commentText);
        commentInput.value = ""; // Clear input
      }
    });
  }

  _addComment(text) {
    const now = new Date();

    const commentsList = document.getElementById("commentsList");
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.innerHTML = `
      <div class="comment-header">
        <span class="user-name">You</span>
        <span class="comment-time">${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
      <div class="comment-content">${text}</div>
    `;
    commentsList.prepend(commentItem); // Prepend for newest first
  }
}
