import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Icons for edit and delete

const AccountTable = ({ accounts, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Account Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No accounts found</td>
            </tr>
          ) : (
            accounts.map((account) => (
              <tr key={account.id} className="border-t border-gray-200">
                <td className="px-6 py-4 text-sm text-gray-800">{account.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{account.balance}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onEdit(account)}
                    className="text-blue-600 hover:text-blue-700 px-2 py-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="text-red-600 hover:text-red-700 px-2 py-1"
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

export default AccountTable;
