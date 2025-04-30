import axiosInstance from "../../lib/Axios";

export const fetchBudgets = async () => {
    try {
        const res = await axiosInstance.get("/api/budgets");
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching budgets:", error.response ? error.response.data : error);
    }
};
export const createBudget =async ()=>{
    try{
        const res=await axiosInstance.post("/api/budgets");
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error creating budget:", error.response ? error.response.data : error);
    }
};

export const updateBudget = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/api/budgets/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Error updating budget:", error.response ? error.response.data : error);
    }
};

export const deleteBudget = async (id) => {
    try {
        const res = await axiosInstance.delete(`/api/budgets/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting budget:", error.response ? error.response.data : error);
    }
};
