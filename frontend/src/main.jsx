import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './components/Auth.jsx'
import HomePage from './components/HomePage.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
    <RouterProvider router={router}/>
  </React.StrictMode>,
)