import React from 'react';
import { BrowserRouter as Router, Routes, Route, RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';

function App() {

  return (
    <>
    <RouterProvider router={router} />;
    </>
  )
}

export default App

