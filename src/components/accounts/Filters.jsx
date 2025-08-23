import { FaSearch } from "react-icons/fa";

const Filters = ({ searchTerm, setSearchTerm, accountTypeFilter, setAccountTypeFilter, accountCategories, accounts, filteredAccounts, loading }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search accounts..."
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div>
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-300 mb-1">
            Account Type
          </label>
          <select
            id="typeFilter"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Types</option>
            {accountCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-gray-400">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
