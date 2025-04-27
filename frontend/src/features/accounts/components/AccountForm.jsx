import { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa"; // Icons for buttons

const AccountForm = ({ initialData, onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("bank"); // Set default type to 'bank'

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBalance(initialData.balance);
      setType(initialData.type || "bank"); // Set default type to 'bank' if editing
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, balance, type }; // Include type when submitting
    if (initialData) {
      onSubmit(initialData.id, data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Account" : "New Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              className="w-full border-gray-300 border rounded-lg px-4 py-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
            <input
              className="w-full border-gray-300 border rounded-lg px-4 py-2"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              className="w-full border-gray-300 border rounded-lg px-4 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaSave /> {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
