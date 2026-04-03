const NotesHeader = () => {
  return (
    <div className="flex justify-between items-center">

      {/* Title */}
      <h1 className="text-2xl font-bold">Notes</h1>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search notes..."
          className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Add Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Add Note
        </button>

      </div>
    </div>
  );
};

export default NotesHeader;