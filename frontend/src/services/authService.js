import API from "./api";
import { jwtDecode } from "../utils/jwtDecode";

const authService = {
  login: async ({ username, password }) => {
    const response = await API.post("/auth/login/tokens", {
      username,
      password,
    });

    const { accessToken, refreshToken, expiresIn } = response.data;

    const decoded = jwtDecode(accessToken);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        username: decoded.sub,
        role: decoded.role || "USER",
      },
    };
  },

  register: async ({ username, password, role = "USER" }) => {
    await API.post("/auth/register", {
      username,
      password,
      role,
    });

    // Auto-login after registration
    const response = await API.post("/auth/login/tokens", {
      username,
      password,
    });

    const { accessToken, refreshToken, expiresIn } = response.data;

    const decoded = jwtDecode(accessToken);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        username: decoded.sub,
        role: decoded.role || "USER",
      },
    };
  },
};

export default authService;