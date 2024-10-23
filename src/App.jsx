import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const getData = async () => {
    try {
      const response = await fetch(
        `https://hiring-api.simbuka.workers.dev/?page=${page}&size=${rowsPerPage}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [rowsPerPage, page]);

  // Sorting
  const sortedData = () => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filtering
  const filteredData = () => {
    let filtered = sortedData();
    // Gender
    if (genderFilter !== "all") {
      filtered = filtered.filter((item) => item.gender === genderFilter);
    }
    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  // Highlight search term in the table
  const highlightMatch = (text, query) => {
    if (!query) return text; // If no search query, return the original text
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="mt-10 w-full sm:w-1/2 mx-auto">
      {/* Search Input */}
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Search by first or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 w-full"
        />
      </div>
      {/* Filter Buttons */}
      <div className="flex justify-center mb-5">
        <button
          className={`border px-4 py-2 mx-2 ${
            genderFilter === "all" ? "bg-gray-300" : ""
          }`}
          onClick={() => setGenderFilter("all")}
        >
          All
        </button>
        <button
          className={`border px-4 py-2 mx-2 ${
            genderFilter === "Male" ? "bg-gray-300" : ""
          }`}
          onClick={() => setGenderFilter("Male")}
        >
          Male
        </button>
        <button
          className={`border px-4 py-2 mx-2 ${
            genderFilter === "Female" ? "bg-gray-300" : ""
          }`}
          onClick={() => setGenderFilter("Female")}
        >
          Female
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border border-black">
              First name
              <button onClick={() => handleSort("firstName")} className="ml-2">
                {sortConfig.key === "firstName"
                  ? sortConfig.direction === "ascending"
                    ? "▲"
                    : "▼"
                  : "⇅"}
              </button>
            </th>
            <th className="border border-black">
              Last name
              <button onClick={() => handleSort("lastName")} className="ml-2">
                {sortConfig.key === "lastName"
                  ? sortConfig.direction === "ascending"
                    ? "▲"
                    : "▼"
                  : "⇅"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData().map((item, index) => (
            <tr key={index}>
              <td className="border border-black">
                {highlightMatch(item.firstName, searchQuery)}
              </td>
              <td className="border border-black">
                {highlightMatch(item.lastName, searchQuery)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className="border px-4"
          onClick={() => (page > 1 ? setPage(page - 1) : null)}
        >
          Previous
        </button>
        <button className="border px-4" onClick={() => setPage(page + 1)}>
          Next
        </button>
        <span className="px-2">Rows per page:</span>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          className="border px-4"
        >
          {/* Generating options from 5 to 20 */}
          {Array.from({ length: 16 }, (_, index) => index + 5).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        {/* Page Number Buttons */}
        <div className="mt-4">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((num) => (
            <button
              key={num}
              className={`border px-4 mx-1 ${
                num === page ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
