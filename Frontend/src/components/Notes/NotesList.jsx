import NoteCard from "./NotesCard";

const NotesList = ({ notes = [] }) => {
  if (notes.length === 0) {
    return (
      <p className="text-gray-500">
        No notes yet. Start by creating one!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;