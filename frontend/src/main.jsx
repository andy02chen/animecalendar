import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './components/Pages/Auth.jsx'
import HomePage from './components/Pages/HomePage.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './components/Alert/Error.jsx'

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
    <Error/>
    <RouterProvider router={router}/>
  </React.StrictMode>
)