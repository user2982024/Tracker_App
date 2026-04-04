import NoteCard from "./NotesCard";

const NotesList = ({ notes = [] }) => {
  if (notes.length === 0) {
    return (
      <p className="text-gray-500 text-sm sm:text-base">
        No notes yet. Start by creating one!
      </p>
    );
  }

  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-4 sm:gap-5
    ">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;