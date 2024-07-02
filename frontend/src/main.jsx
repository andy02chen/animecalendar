import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './components/Auth.jsx'
import HomePage from './components/HomePage.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Alert from './components/Alert.jsx'

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
    <RouterProvider router={router}/>
  </React.StrictMode>,
)