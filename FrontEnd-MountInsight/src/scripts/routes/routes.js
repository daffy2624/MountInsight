import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import HomePage from "../pages/home/home-page";
import MountainPage from "../pages/mountain/mountain-page";
import ProfilePage from "../pages/profile/profile-page";

const routes = {
  '/': new HomePage(),
  '/mountain/:id': new MountainPage(),
  '/profile': new ProfilePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
};

export default routes;
