import { useState, useEffect } from 'react'
import './App.css'
import Auth from "./Auth.jsx"
import HomePage from './HomePage.jsx'
import axios from "axios"

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? <HomePage/> : <Auth/>}
    </>
  );
}

export default App
