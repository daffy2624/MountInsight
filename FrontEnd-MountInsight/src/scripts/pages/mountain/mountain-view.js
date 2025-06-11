export default class MountainView {
  getTemplate() {
    return `
      <section id="mountain-hero" class="mountain-hero"></section>
      <section class="comments-section" id="comment-section"></section>
    `;
  }

  renderHero(mountain) {
    const section = document.getElementById("mountain-hero");
    if (!section || !mountain) return;

    section.innerHTML = `
      <div class="image-container">
        <img src="${mountain.image}" alt="${mountain.name}" class="mountain-image">
        <h1>${mountain.name}</h1>
      </div>
      <div class="mountain content">
        <div class="mountain-intro">
          <p>${mountain.deskripsi}</p>
        </div>
      </div>
    `;
  }

  renderCommentSection(mountainId, comments = []) {
    const section = document.getElementById("comment-section");
    if (!section) return;

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
        ${comments.map((c) => `
          <div class="comment-item">
            <div class="comment-header">
              <span class="user-name">${c.user_name || 'Anon'}</span>
              <span class="comment-time">${c.created_at}</span>
            </div>
            <div class="comment-content">${c.content}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderError(message) {
    const heroSection = document.getElementById("mountain-hero");
    const commentSection = document.getElementById("comment-section");

    if (heroSection) {
      heroSection.innerHTML = `
        <div class="error-message">
          <p style="color: red; font-weight: bold;">${message}</p>
        </div>
      `;
    }

    if (commentSection) {
      commentSection.innerHTML = '';
    }
  }
}
