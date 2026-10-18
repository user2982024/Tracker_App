const NotesHeader = ({ onAddClick, onDeleteAllClick, onSearch, searchQuery = "", canDeleteNotes = true }) => {
  // Hndle input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
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
          className="bg-input text-foreground border border-border rounded-lg px-3 py-2 w-64 placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {canDeleteNotes && (
          <button
            onClick={onDeleteAllClick}
            className="text-red-600 dark:text-red-300 px-3 py-2 rounded-lg text-sm border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
          >
            Delete All
          </button>
        )}

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
