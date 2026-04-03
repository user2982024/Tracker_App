import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";

const NotesPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <NotesHeader />

      {/* Notes Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          All Notes <span className="text-gray-500">(0)</span>
        </h2>

        <NotesList notes={[]} />
      </div>

    </div>
  );
};

export default NotesPage;