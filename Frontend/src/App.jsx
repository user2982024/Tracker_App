import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage  from './components/LandingPage';
import Signup from './components/SignUp';

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </div>
  )
}

export default App
