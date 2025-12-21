import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage  from './components/LandingPage';
import Signup from './components/SignUp';
import Signin from './components/SignIn';

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/>
      </Routes>
    </div>
  )
}

export default App
