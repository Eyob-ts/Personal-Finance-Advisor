import { useEffect, useState } from "react";
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../budgetApi";
import BudgetCard from "../components/BudgetCard";
import BudgetForm from "../components/BudgetForm";

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [mode, setMode] = useState("list");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchBudgets().then((res) => setBudgets(res.data));
  }, []);

  const handleCreate = () => {
    setFormData(null);
    setMode("create");
  };

  const handleEdit = (budget) => {
    setFormData(budget);
    setMode("edit");
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = async (data) => {
    if (mode === "edit") {
      const res = await updateBudget(data.id, data);
      setBudgets((prev) => prev.map((b) => (b.id === res.data.id ? res.data : b)));
    } else {
      const res = await createBudget(data);
      setBudgets((prev) => [...prev, res.data]);
    }

    setMode("list");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      {mode === "list" && (
        <>
          <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
            + New Budget
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} onEdit={() => handleEdit(budget)} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <BudgetForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setMode("list")}
        />
      )}
    </div>
  );
};

export default BudgetsPage;
