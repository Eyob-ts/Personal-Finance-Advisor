import axiosInstance from "../../lib/Axios";

export const getGoals = async () => {
  try {
    const res = await axiosInstance.get("api/goals");
    return res.data;
  } catch (error) {
    console.error("Error fetching goals:", error.response ? error.response.data : error);
    throw error;
  }
};

export const createGoal = async (data) => {
  try {
    const res = await axiosInstance.post("api/goals", data);
    return res.data;
  } catch (error) {
    console.error("Error creating goal:", error.response ? error.response.data : error);
    throw error;
  }
};

export const getGoal = async (id) => {
  try {
    const res = await axiosInstance.get(`api/goals/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching goal:", error.response ? error.response.data : error);
    throw error;
  }
};

export const updateGoal = async (id, data) => {
  try {
    const res = await axiosInstance.put(`api/goals/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating goal:", error.response ? error.response.data : error);
    throw error;
  }
};

export const deleteGoal = async (id) => {
  try {
    const res = await axiosInstance.delete(`api/goals/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting goal:", error.response ? error.response.data : error);
    throw error;
  }
};

// Helper function to calculate progress percentage
export const calculateProgress = (current, target) => {
  return Math.min(100, Math.round((current / target) * 100));
};