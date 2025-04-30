import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaCoins } from "react-icons/fa";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../accountApi";
import AccountTable from "../components/AccountTable";
import AccountForm from "../components/AccountForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchAccounts = async () => {
    const data = await getAccounts();
    setAccounts(data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (accountData) => {
    await createAccount(accountData);
    fetchAccounts();
    setModalOpen(false);
  };

  const handleUpdate = async (id, accountData) => {
    await updateAccount(id, accountData);
    fetchAccounts();
    setModalOpen(false);
    setSelected(null);
  };

  const handleDelete = async (id) => {
    await deleteAccount(id);
    fetchAccounts();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#001A16] to-[#000F0C]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <FaCoins className="text-teal-400 mr-3 text-2xl" />
          <h1 className="text-3xl font-bold text-teal-100 font-orbitron tracking-wider">
            ACCOUNT MANAGEMENT
          </h1>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="px-6 py-3 bg-teal-600/90 text-white rounded-lg hover:bg-teal-500 flex items-center gap-2 group hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 font-rajdhani font-medium tracking-wide"
        >
          <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
          NEW ACCOUNT
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-sm uppercase tracking-wider">Total Accounts</h3>
          <p className="text-2xl font-bold text-white font-orbitron">{accounts.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-sm uppercase tracking-wider">Total Balance</h3>
          <p className="text-2xl font-bold text-white font-orbitron">
            ${accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0).toFixed(2)}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-teal-800/50">
          <h3 className="text-teal-300 font-rajdhani text-sm uppercase tracking-wider">Last Updated</h3>
          <p className="text-lg font-medium text-white font-rajdhani">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="mb-8">
        <AccountTable
          accounts={accounts}
          onEdit={(account) => {
            setSelected(account);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AccountForm
          initialData={selected}
          onSubmit={selected ? handleUpdate : handleCreate}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
        />
      )}

      {/* Footer Note */}
      <div className="text-center text-teal-700/80 text-xs font-rajdhani mt-8">
        <p>SYSTEM VERSION 2.3.8 | SECURE CONNECTION ESTABLISHED</p>
      </div>
    </div>
  );
};

export default AccountsPage;