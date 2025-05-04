import { FaFilter, FaSearch, FaCalendarAlt } from "react-icons/fa";

const TransactionFilters = ({
  filters,
  onFilterChange,
  accounts,
  categories,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-teal-800/50 mb-4 backdrop-blur-sm">
      <div className="flex items-center mb-3 sm:mb-4">
        <FaFilter className="text-teal-400 mr-2 text-sm sm:text-base" />
        <h3 className="text-teal-300 font-rajdhani font-medium tracking-wide text-sm sm:text-base">
          TRANSACTION FILTERS
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input - Full width on mobile, then normal */}
        <div className="relative col-span-2 sm:col-span-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-teal-400">
            <FaSearch className="text-sm sm:text-base" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search..."
            className="w-full bg-[#002822] border border-teal-800 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
          />
        </div>

        {/* Type Select */}
        <div>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 appearance-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
          >
            <option value="" className="bg-[#001A16]">All Types</option>
            <option value="income" className="bg-[#001A16]">Income</option>
            <option value="expense" className="bg-[#001A16]">Expense</option>
          </select>
        </div>

        {/* Account Select */}
        <div>
          <select
            name="account_id"
            value={filters.account_id}
            onChange={handleChange}
            className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 appearance-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
          >
            <option value="" className="bg-[#001A16]">All Accounts</option>
            {accounts?.map((account) => (
              <option key={account.id} value={account.id} className="bg-[#001A16]">
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div>
          <select
            name="category_id"
            value={filters.category_id}
            onChange={handleChange}
            className="w-full bg-[#002822] border border-teal-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 appearance-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
          >
            <option value="" className="bg-[#001A16]">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id} className="bg-[#001A16]">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range - Full width on all screens */}
        <div className="col-span-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-teal-400">
                <FaCalendarAlt className="text-sm sm:text-base" />
              </div>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-800 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-teal-400">
                <FaCalendarAlt className="text-sm sm:text-base" />
              </div>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleChange}
                className="w-full bg-[#002822] border border-teal-800 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-teal-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 font-rajdhani"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;