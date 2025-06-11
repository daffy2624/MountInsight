export default class LoginView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="overlay"></div>
        <div class="form-container auth">
          <div class="form-content active">
            <div class="form-header">
              <h1>Welcome Back</h1>
            </div>
            <form id="loginForm">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" placeholder="your.email@example.com" required />
              </div>
              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" class="password-input" placeholder="........" required />
              </div>
              <button type="submit" class="form-btn">Login</button>
              <div class="switch-form">
                Don’t have an account? <a href="#/register">Register</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }
}
