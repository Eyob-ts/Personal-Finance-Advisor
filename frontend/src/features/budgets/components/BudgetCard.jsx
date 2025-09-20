const BudgetCard = ({ budget, onEdit, onDelete }) => {
    return (
      <div className="border p-4 rounded shadow space-y-2">
        <h2 className="text-lg font-semibold">Amount: ${budget.amount}</h2>
        <p>Category ID: {budget.category_id}</p>
        <p>{budget.start_date} → {budget.end_date}</p>
        <div className="flex gap-3">
          <button onClick={onEdit} className="text-blue-600">Edit</button>
          <button onClick={() => onDelete(budget.id)} className="text-red-600">Delete</button>
        </div>
      </div>
    );
  };

  export default BudgetCard;
