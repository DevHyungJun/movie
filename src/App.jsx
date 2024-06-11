import React, { useState } from 'react';
import { SearchScreen } from './components/search';
import './App.css';


const API_KEY = '4ac61429713672261782f10ba3e8de9b';

const App = () => {
  return (
    <div>
      <SearchScreen API_KEY={API_KEY}/>
    </div>
  );
};

export default App

