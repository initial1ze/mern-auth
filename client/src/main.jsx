import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Signup from './pages/Signup.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: 'signup',
        element: <Signup />,
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'dashboard',
        element: <Dashboard />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />

        <Toaster />
    </React.StrictMode>
);
