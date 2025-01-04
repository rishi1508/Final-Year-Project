import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarMenu from "./datasheet"; 
import Home from './components/Home'; 
import Khatiyan from './components/Khatiyan'; 
import Mutation from './components/Mutation'; 
import Search from './components/Search'; 
import Settings from './components/Settings'; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/records" element={<SidebarMenu />} />
          <Route path="/khatiyan" element={<Khatiyan />} />
          <Route path="/mutation" element={<Mutation />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} /> 
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
