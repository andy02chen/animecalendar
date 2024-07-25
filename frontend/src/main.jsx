import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './components/Pages/Auth.jsx'
import HomePage from './components/Pages/HomePage.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Alert from './components/Alert/Alert.jsx'
import Popup from './components/Alert/Popup.jsx'

const router = createBrowserRouter([
  {
    path: "/a",
    element: <Auth/>
  },
  {
    path: "/home",
    element: <HomePage/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Alert/>
    <Popup/>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)