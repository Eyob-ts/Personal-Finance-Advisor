import axiosInstance from "../../lib/Axios";

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/api/categories");
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response ? error.response.data : error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const res = await axiosInstance.post("/api/categories", data);
    return res.data;
  } catch (error) {
    console.error("Error creating category:", error.response ? error.response.data : error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/categories/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating category:", error.response ? error.response.data : error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting category:", error.response ? error.response.data : error);
    throw error;
  }
};
