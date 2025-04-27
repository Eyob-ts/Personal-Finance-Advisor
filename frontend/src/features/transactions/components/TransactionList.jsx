import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  console.log("TransactionList received transactions:", transactions);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!transactions || transactions.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-gray-200">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {transaction.created_at ? format(new Date(transaction.created_at), "MMM dd, yyyy") : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  ${transaction.amount ? transaction.amount.toFixed(2) : "0.00"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {transaction.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {transaction.account?.name || "Unknown Account"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {transaction.description || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-blue-600 hover:text-blue-700 px-2 py-1"
                    title="Edit Transaction"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700 px-2 py-1"
                    title="Delete Transaction"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
