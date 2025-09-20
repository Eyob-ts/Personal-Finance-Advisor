import axiosInstance from "../../lib/Axios";

export const getAccounts = async () => {
    try {
      const res = await axiosInstance.get("/api/accounts");
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching accounts:", error.response ? error.response.data : error);
      // Optionally, redirect the user to the login page or show a notification
    }
  };

  export const createAccount = async (data) => {
    try {
      const res = await axiosInstance.post("/api/accounts", data);
      return res.data;
    } catch (error) {
      console.error("Error creating account:", error.response ? error.response.data : error);
    }
  };

  export const updateAccount = async (id, data) => {
    try {
      const res = await axiosInstance.put(`/api/accounts/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Error updating account:", error.response ? error.response.data : error);
    }
  };

  export const deleteAccount = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/accounts/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting account:", error.response ? error.response.data : error);
    }
  };

