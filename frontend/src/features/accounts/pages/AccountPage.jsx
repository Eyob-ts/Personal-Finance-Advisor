import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa"; // Importing icons
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../accountApi";
import AccountTable from "../components/AccountTable";
import AccountForm from "../components/AccountForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null); // for editing
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Accounts</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Account
        </button>
      </div>

      <AccountTable
        accounts={accounts}
        onEdit={(account) => {
          setSelected(account);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

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
    </div>
  );
};

export default AccountsPage;
