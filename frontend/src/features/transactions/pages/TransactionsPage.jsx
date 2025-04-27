import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import TransactionFilters from "../components/TransactionFilters";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../transactionApi";
import { getAccounts } from "../../accounts/accountApi";
import { getCategories } from "../../categories/categoryApi";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    account_id: "",
    category_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, accountsData, categoriesData] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getCategories(),
      ]);
      console.log("Fetched transactions:", transactionsData);
      setTransactions(transactionsData);
      setAccounts(accountsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      const newTransaction = await createTransaction(data);
      setTransactions((prev) => [...prev, newTransaction]);
      setShowForm(false);
    } catch (err) {
      setError("Failed to create transaction. Please try again.");
      console.error("Error creating transaction:", err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updatedTransaction = await updateTransaction(id, data);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      setShowForm(false);
      setSelectedTransaction(null);
    } catch (err) {
      setError("Failed to update transaction. Please try again.");
      console.error("Error updating transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError("Failed to delete transaction. Please try again.");
        console.error("Error deleting transaction:", err);
      }
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = !filters.search ||
      (transaction.description &&
       transaction.description.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesAccount =
      !filters.account_id || transaction.account_id === filters.account_id;
    const matchesCategory =
      !filters.category_id || transaction.category_id === filters.category_id;
    const matchesDateRange =
      (!filters.start_date ||
        new Date(transaction.created_at) >= new Date(filters.start_date)) &&
      (!filters.end_date ||
        new Date(transaction.created_at) <= new Date(filters.end_date));

    return (
      matchesSearch &&
      matchesType &&
      matchesAccount &&
      matchesCategory &&
      matchesDateRange
    );
  });

  console.log("Filtered transactions:", filteredTransactions);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FaPlus /> New Transaction
        </button>
      </div>

      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        accounts={accounts}
        categories={categories}
      />

      {transactions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No transactions found. Create your first transaction!</p>
        </div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <TransactionForm
          initialData={selectedTransaction}
          onSubmit={selectedTransaction ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setSelectedTransaction(null);
          }}
          accounts={accounts}
          categories={categories}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
