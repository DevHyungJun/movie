import React, { useState } from 'react';
import { SearchScreen } from './components/search';
import './App.css';


const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  return (
    <div>
      <SearchScreen API_KEY={API_KEY}/>
    </div>
  );
};

export default App

