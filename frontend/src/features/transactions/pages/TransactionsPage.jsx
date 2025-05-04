import { useState, useEffect } from "react";
import { FaPlus, FaCoins, FaExchangeAlt } from "react-icons/fa";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#001A16] to-[#000F0C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded relative font-rajdhani">
        {error}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#001A16] to-[#000F0C]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center">
          <FaExchangeAlt className="text-teal-400 mr-2 sm:mr-3 text-xl sm:text-2xl" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-100 font-orbitron tracking-wider">
            TRANSACTION MANAGEMENT
          </h1>
        </div>

        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-teal-600/90 text-white rounded-lg hover:bg-teal-500 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 font-rajdhani font-medium tracking-wide text-sm sm:text-base"
        >
          <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
          NEW TRANSACTION
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="glass-panel p-2 sm:p-3 md:p-4 rounded-xl border border-teal-800/50 col-span-2 sm:col-span-1">
          <h3 className="text-teal-300 font-rajdhani text-xs sm:text-sm uppercase tracking-wider">Total Transactions</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white font-orbitron">{transactions.length}</p>
        </div>
        <div className="glass-panel p-2 sm:p-3 md:p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-xs sm:text-sm uppercase tracking-wider">Income</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white font-orbitron">
            ${transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="glass-panel p-2 sm:p-3 md:p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-xs sm:text-sm uppercase tracking-wider">Expenses</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white font-orbitron">
            ${transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="glass-panel p-2 sm:p-3 md:p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-xs sm:text-sm uppercase tracking-wider">Last Updated</h3>
          <p className="text-sm sm:text-base md:text-lg font-medium text-white font-rajdhani">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6">
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          accounts={accounts}
          categories={categories}
        />
      </div>

      {/* Main Table */}
      <div className="mb-6 sm:mb-8">
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          accounts={accounts}
        />
      </div>

      {/* Form Modal */}
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

      {/* Footer Note */}
      <div className="text-center text-teal-700/80 text-xs font-rajdhani mt-6 sm:mt-8">
        <p>SYSTEM VERSION 2.3.8 | SECURE CONNECTION ESTABLISHED</p>
      </div>
    </div>
  );
};

export default TransactionsPage;