import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaWallet, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const AccountForm = ({ initialData, onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("bank");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBalance(initialData.balance);
      setType(initialData.type || "bank");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, balance, type };
    if (initialData) {
      onSubmit(initialData.id, data);
    } else {
      onSubmit(data);
    }
  };

  const getTypeIcon = () => {
    switch(type) {
      case 'bank': return <FaWallet className="mr-2" />;
      case 'credit_card': return <FaCreditCard className="mr-2" />;
      case 'cash': return <FaMoneyBillWave className="mr-2" />;
      default: return <FaWallet className="mr-2" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#01332B] to-[#001A16] p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md md:w-96 border border-teal-400/20 relative overflow-y-auto max-h-[90vh]">
        {/* Holographic effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30"></div>

        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-teal-100 font-orbitron tracking-wider">
            {initialData ? "EDIT ACCOUNT" : "NEW ACCOUNT"}
          </h2>
          <button
            onClick={onClose}
            className="text-teal-300 hover:text-white transition-colors duration-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-teal-200 mb-1 sm:mb-2 font-rajdhani tracking-wide">
              ACCOUNT NAME
            </label>
            <div className="relative">
              <input
                className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-teal-400 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-teal-200 mb-1 sm:mb-2 font-rajdhani tracking-wide">
              BALANCE
            </label>
            <input
              className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-teal-200 mb-1 sm:mb-2 font-rajdhani tracking-wide">
              ACCOUNT TYPE
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="bank">Bank Account</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-400">
                {getTypeIcon()}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-transparent border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/30 hover:text-red-300 transition-all duration-300 font-rajdhani font-medium tracking-wide text-sm sm:text-base"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-600/90 text-white rounded-lg hover:bg-teal-500 flex items-center gap-2 group hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 font-rajdhani font-medium tracking-wide text-sm sm:text-base"
            >
              <FaSave className="transition-transform duration-300 group-hover:scale-110 text-sm sm:text-base" />
              {initialData ? "UPDATE" : "CREATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;