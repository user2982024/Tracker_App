import NoteCard from "./NotesCard";

const NotesList = ({ notes = [], onEdit, onDelete, onArchive, onUnarchive, onPin, onUnpin, mode, emptyState }) => {
  if (notes.length === 0) {
    return (
      emptyState || (
        <p className="mt-4 text-center text-sm text-foreground-muted sm:text-base" role="status">
          No notes to show.
        </p>
      )
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
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} onArchive={onArchive} onUnarchive={onUnarchive} onPin={onPin} onUnpin={onUnpin} mode={mode} />
      ))}
    </div>
  );
};

export default NotesList;
