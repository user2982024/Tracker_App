import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import Notes from "./components/Notes";
import Todos from "./components/Todos";
import NoteForm from "./components/NoteForm";
import ArchivedNotes from "./components/ArchivedNotes";
import ProtectedRoute from "./components/ProtectedRoutes";
import TodoForm from "./components/TodoForm";

import MainLayout from "./layouts/MainLayout"
import EmptyLayout from "./layouts/EmptyLayout"

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/archived" element={<ArchivedNotes />}/>
            <Route path="/todos" element={<Todos />} />
          </Route>
          <Route element={<EmptyLayout />}>
            <Route path="/notes/add" element={<NoteForm mode="create"/>}/>
            <Route path="/notes/edit/:id" element={<NoteForm mode="edit"/>}/>
            <Route path="/todos/add" element={<TodoForm />}/>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;


