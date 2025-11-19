import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MachineTable from './pages/MachineTable';
import MachineDetails from './pages/MachineDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MachineTable />} />
        <Route path="/machine/:id" element={<MachineDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
