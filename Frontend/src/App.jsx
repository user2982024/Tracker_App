import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage  from './components/LandingPage';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import Notes from './components/Notes';
import Todos from './components/Todos';

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/>
        <Route path="/notes" element={<Notes />}/>
        <Route path="/todos" element={<Todos />}/>
      </Routes>
    </div>
  )
}

export default App
