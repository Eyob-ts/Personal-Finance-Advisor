import axiosInstance from "../../lib/Axios";

/**
 * Fetches the financial summary data
 * @returns {Promise<{
 *   balance: number,
 *   monthly_income: number,
 *   monthly_expense: number,
 *   savings: number
 * }>}
 */
export const getFinancialSummary = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch financial summary");
  }
};

/**
 * Fetches spending breakdown by category
 * @returns {Promise<{
 *   categories: Array<{
 *     name: string,
 *     amount: number,
 *     percentage: number
 *   }>
 * }>}
 */
export const getSpendingByCategory = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/spending");
    return response.data;
  } catch (error) {
    console.error("Error fetching spending by category:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch spending by category");
  }
};

export const getRecentTransactions = async () => {
  try {
    const res = await axiosInstance.get("/api/dashboard/recent");
    return res.data;
  } catch (error) {
    console.error("Error fetching recent transactions:", error.response ? error.response.data : error);
    throw error;
  }
};

export const getMonthlyTrends = async () => {
  try {
    const res = await axiosInstance.get("/api/dashboard/trend");
    return res.data;
  } catch (error) {
    console.error("Error fetching monthly trends:", error.response ? error.response.data : error);
    throw error;
  }
};
