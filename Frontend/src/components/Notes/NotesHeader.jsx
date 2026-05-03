import { useState } from "react";

const NotesHeader = ({ onAddClick, onDeleteAllClick, onSearch }) => {

  // State for input
  const [searchQuery, setSearchQuery] = useState("");

  // Hndle input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Send value to parent
    onSearch(value);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Notes</h1>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Delete All Button */}
        <button
          onClick={onDeleteAllClick}
          className="text-red-600 px-3 py-2 rounded-lg text-sm border border-red-200 hover:bg-red-50 transition cursor-pointer"
        >
          Delete All
        </button>

        {/* Add Note Button */}
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesHeader;