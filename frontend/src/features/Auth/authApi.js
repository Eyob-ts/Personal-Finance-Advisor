import axiosInstance from "../../lib/Axios";

export const register = async ({ name, email, password, password_confirmation }) => {
  const response = await axiosInstance.post("/register", {
    name,
    email,
    password,
    password_confirmation,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/logout");
  return response.data;
};

// Optional: Fetch user data if needed
export const getUser = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};