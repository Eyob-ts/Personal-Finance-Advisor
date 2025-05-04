import { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

const TransactionForm = ({ initialData, onSubmit, onClose, accounts, categories }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    account_id: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        description: initialData.description || "",
        account_id: initialData.account_id,
        category_id: initialData.category_id,
        date: new Date(initialData.created_at).toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      transaction_date: formData.date,
    };
    delete submissionData.date;

    if (initialData) {
      onSubmit(initialData.id, submissionData);
    } else {
      onSubmit(submissionData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#01332B] to-[#001A16] p-8 rounded-lg shadow-2xl shadow-black w-[500px] border-teal-400/20 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-teal-100 font-orbitron tracking-wide ">
            {initialData ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-teal-300 hover:text-white transition-colors duration-300"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2 font-rajdhani tracking-wide">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
                required
              >
                <option className="bg-[#001A16] hover:bg-[#01332B]" value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2 font-rajdhani tracking-wide">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-300 mb-2 font-rajdhani tracking-wide">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-2 font-rajdhani tracking-wide">Account</label>
              <select
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
                required
              >
                <option value="">Select Account</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-2 font-rajdhani tracking-wide">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
                required
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-800 mb-2 font-rajdhani tracking-wide">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#002822] border border-teal-700 rounded-lg px-4 py-3 text-teal-00 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
              rows="3"
              placeholder="Enter transaction description"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/30 hover:text-red-300 transition-all duration-300 font-rajdhani front-medium tracking-wide">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600/90 text-white rounded-lg hover:bg-teal-500 flex items-center gap-2 group hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 font-rajdhani font-medium tracking-wide"
            >
              <FaSave className="transition-transform duration-300 group-hover:scale-110"
              /> {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
