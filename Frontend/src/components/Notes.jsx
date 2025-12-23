import React from "react";
import { Plus, StickyNote } from "lucide-react";

const Notes = () => {
  const notes = []; // empty state for now

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Notes</h1>
          <p className="text-sm text-gray-500">{notes.length} notes in total</p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 transition">
          <Plus size={18} />
          Add Note
        </button>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-4">
            <StickyNote className="text-violet-600" size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">No notes to show</h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            You haven’t created any notes yet. Start capturing your ideas,
            tasks, or thoughts by adding your first note.
          </p>

          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-violet-700 transition">
            <Plus size={18} />
            Create your first note
          </button>
        </div>
      )}
    </section>
  );
};

export default Notes;
