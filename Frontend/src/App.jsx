import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import Notes from "./components/Notes";
import Todos from "./components/Todos";
import NoteForm from "./components/NoteForm";
import ArchivedNotes from "./components/ArchivedNotes";
import ProtectedRoute from "./components/ProtectedRoutes";
import TodoForm from "./components/TodoForm";

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/add" element={<NoteForm mode="create"/>}/>
          <Route path="/notes/edit/:id" element={<NoteForm mode="edit"/>}/>
          <Route path="/notes/archived" element={<ArchivedNotes />}/>
          <Route path="/todos" element={<Todos />} />
          <Route path="/todos/add" element={<TodoForm />}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
