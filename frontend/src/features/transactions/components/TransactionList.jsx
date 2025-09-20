import { FaEdit, FaTrashAlt, FaExchangeAlt } from "react-icons/fa";
import { format } from "date-fns";

const TransactionList = ({ transactions, onEdit, onDelete, accounts }) => {
  const getAccountColor = (accountId) => {
    const account = accounts?.find(a => a.id === accountId);
    if (!account) return "text-teal-300";
    switch(account.type) {
      case 'bank': return "text-teal-400";
      case 'credit_card': return "text-purple-400";
      case 'cash': return "text-green-400";
      default: return "text-teal-300";
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-teal-800/50 bg-gradient-to-b from-[#01332B]/80 to-[#001A16]/80 backdrop-blur-sm shadow-2xl">
      {/* Desktop Table (hidden on mobile) */}
      <table className="hidden sm:table min-w-full divide-y divide-teal-900/50">
        <thead className="bg-teal-900/30">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              DATE
            </th>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              TYPE
            </th>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              AMOUNT
            </th>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              CATEGORY
            </th>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              ACCOUNT
            </th>
            <th className="px-4 py-3 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              DESCRIPTION
            </th>
            <th className="px-4 py-3 text-center text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-teal-900/30">
          {renderDesktopRows()}
        </tbody>
      </table>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="sm:hidden space-y-3 p-3">
        {renderMobileCards()}
      </div>

      {/* Empty State */}
      {(!transactions || transactions.length === 0) && (
        <div className="px-6 py-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-3 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-500">
              <FaExchangeAlt size={24} />
            </div>
            <span className="text-teal-400 font-rajdhani">NO TRANSACTIONS FOUND</span>
            <span className="text-teal-600 text-sm mt-1 font-rajdhani">Create your first transaction to begin</span>
          </div>
        </div>
      )}
    </div>
  );

  function renderDesktopRows() {
    if (!transactions || transactions.length === 0) return null;

    return transactions.map((transaction) => (
      <tr key={transaction.id} className="hover:bg-teal-900/10 transition-colors duration-200">
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="text-teal-100 font-rajdhani text-sm">
            {transaction.created_at ? format(new Date(transaction.created_at), "MMM dd, yyyy") : "N/A"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold font-rajdhani ${
              transaction.type === "income"
                ? "bg-teal-900/50 text-teal-300 border border-teal-400/30"
                : "bg-red-900/30 text-red-300 border border-red-400/30"
            }`}
          >
            {transaction.type?.toUpperCase() || "UNKNOWN"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`font-rajdhani font-medium text-sm ${
            transaction.type === "income" ? "text-teal-300" : "text-red-300"
          }`}>
            ${transaction.amount ? transaction.amount.toFixed(2) : "0.00"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="text-teal-100 font-rajdhani text-sm">
            {transaction.category?.name || "UNCATEGORIZED"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`${getAccountColor(transaction.account_id)} font-rajdhani text-sm`}>
            {transaction.account?.name || "UNKNOWN ACCOUNT"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-teal-200 font-rajdhani text-sm line-clamp-1">
            {transaction.description || "-"}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => onEdit(transaction)}
              className="text-teal-400 hover:text-teal-200 p-2 rounded-full hover:bg-teal-900/30 transition-all duration-300 group"
              aria-label="Edit transaction"
            >
              <FaEdit className="group-hover:scale-110 transition-transform duration-300" size={14} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="text-red-400 hover:text-red-200 p-2 rounded-full hover:bg-red-900/30 transition-all duration-300 group"
              aria-label="Delete transaction"
            >
              <FaTrashAlt className="group-hover:scale-110 transition-transform duration-300" size={14} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  function renderMobileCards() {
    if (!transactions || transactions.length === 0) return null;

    return transactions.map((transaction) => (
      <div key={transaction.id} className="bg-[#002822]/50 rounded-lg p-3 border border-teal-800/30">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-xs text-teal-400 font-rajdhani">Date</p>
            <p className="text-teal-100 font-rajdhani text-sm">
              {transaction.created_at ? format(new Date(transaction.created_at), "MMM dd") : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-teal-400 font-rajdhani">Type</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold font-rajdhani ${
                transaction.type === "income"
                  ? "bg-teal-900/50 text-teal-300 border border-teal-400/30"
                  : "bg-red-900/30 text-red-300 border border-red-400/30"
              }`}
            >
              {transaction.type?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
          <div>
            <p className="text-xs text-teal-400 font-rajdhani">Amount</p>
            <p className={`font-rajdhani font-medium text-sm ${
              transaction.type === "income" ? "text-teal-300" : "text-red-300"
            }`}>
              ${transaction.amount ? transaction.amount.toFixed(2) : "0.00"}
            </p>
          </div>
          <div>
            <p className="text-xs text-teal-400 font-rajdhani">Account</p>
            <p className={`${getAccountColor(transaction.account_id)} font-rajdhani text-sm`}>
              {transaction.account?.name || "UNKNOWN"}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-xs text-teal-400 font-rajdhani">Description</p>
          <p className="text-teal-200 font-rajdhani text-sm line-clamp-2">
            {transaction.description || "-"}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-teal-800/30">
          <div>
            <p className="text-xs text-teal-400 font-rajdhani">Category</p>
            <p className="text-teal-100 font-rajdhani text-sm">
              {transaction.category?.name || "UNCATEGORIZED"}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(transaction)}
              className="text-teal-400 hover:text-teal-200 p-2 rounded-full hover:bg-teal-900/30 transition-all duration-300 group"
              aria-label="Edit transaction"
            >
              <FaEdit className="group-hover:scale-110 transition-transform duration-300" size={14} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="text-red-400 hover:text-red-200 p-2 rounded-full hover:bg-red-900/30 transition-all duration-300 group"
              aria-label="Delete transaction"
            >
              <FaTrashAlt className="group-hover:scale-110 transition-transform duration-300" size={14} />
            </button>
          </div>
        </div>
      </div>
    ));
  }
};

export default TransactionList;