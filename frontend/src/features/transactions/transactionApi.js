import axiosInstance from "../../lib/Axios";

export const getTransactions = async () => {
  try {
    const res = await axiosInstance.get("/api/transactions");
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response ? error.response.data : error);
    throw error;
  }
};

export const createTransaction = async (data) => {
  try {
    const res = await axiosInstance.post("/api/transactions", data);
    return res.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response ? error.response.data : error);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/transactions/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating transaction:", error.response ? error.response.data : error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/transactions/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting transaction:", error.response ? error.response.data : error);
    throw error;
  }
};
