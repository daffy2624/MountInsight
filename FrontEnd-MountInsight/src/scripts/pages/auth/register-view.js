export default class RegisterView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="overlay"></div>
        <div class="form-container auth">
          <div class="form-content active">
            <div class="form-header">
              <h1>Create Account</h1>
            </div>
            <form id="registerForm">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" required placeholder="Your full name" />
              </div>

              <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" required min="1" placeholder="e.g. 18" />
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                  <option value="" disabled selected>Select your gender</option>
                  <option value="L">Male</option>
                  <option value="P">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required placeholder="you@example.com" />
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required placeholder="Enter password" />
              </div>

              <button type="submit" class="form-btn">Register</button>

              <div class="switch-form">
                Already have an account? <a href="#/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }
}
