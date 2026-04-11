import NoteCard from "./NotesCard";

const NotesList = ({ notes = [], onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <p className="text-gray-500 text-sm sm:text-base mt-4">
        No notes yet. Start by creating one!
      </p>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4 sm:gap-5 mt-4
      "
    >
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotesList;