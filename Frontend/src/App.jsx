import React from 'react'
import Navbar from './components/Navbar';
import MainSreen_1 from './components/MainScreen_1';
import Card_1_Section from './components/Card_1_Section';
import MainScreen_2 from './components/MainScreen_2';
import Ending from './components/Ending';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <MainSreen_1 />
      <Card_1_Section />
      <MainScreen_2 />
      <Ending />
      <Footer />
    </div>
  )
}

export default App
