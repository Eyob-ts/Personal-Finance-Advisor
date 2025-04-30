import { FaEdit, FaTrashAlt, FaWallet, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const AccountTable = ({ accounts, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'bank': return <FaWallet className="mr-2 text-teal-400" />;
      case 'credit_card': return <FaCreditCard className="mr-2 text-purple-400" />;
      case 'cash': return <FaMoneyBillWave className="mr-2 text-green-400" />;
      default: return <FaWallet className="mr-2 text-teal-400" />;
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-teal-800/50 bg-gradient-to-b from-[#01332B]/80 to-[#001A16]/80 backdrop-blur-sm shadow-2xl">
      <table className="min-w-full divide-y divide-teal-900/50">
        <thead className="bg-teal-900/30">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              Account
            </th>
            <th className="px-6 py-4 text-left text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-4 text-center text-xs font-orbitron font-bold text-teal-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-teal-900/30">
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-500">
                    <FaWallet size={24} />
                  </div>
                  <span className="text-teal-400 font-rajdhani">NO ACCOUNTS FOUND</span>
                  <span className="text-teal-600 text-sm mt-1 font-rajdhani">Create your first account to begin</span>
                </div>
              </td>
            </tr>
          ) : (
            accounts.map((account) => (
              <tr key={account.id} className="hover:bg-teal-900/10 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(account.type)}
                    <span className="text-teal-100 font-rajdhani font-medium">{account.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-teal-50 font-rajdhani font-medium">
                    ${parseFloat(account.balance).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => onEdit(account)}
                      className="text-teal-400 hover:text-teal-200 p-2 rounded-full hover:bg-teal-900/30 transition-all duration-300 group"
                    >
                      <FaEdit className="group-hover:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="text-red-400 hover:text-red-200 p-2 rounded-full hover:bg-red-900/30 transition-all duration-300 group"
                    >
                      <FaTrashAlt className="group-hover:scale-110 transition-transform duration-300" />
                    </button>
                  </div>
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