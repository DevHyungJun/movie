import React, { useState } from 'react';
import { SearchScreen } from './components/search';
import './App.css';

const App = () => {
const API_KEY = import.meta.env.VITE_API_KEY;

const upEvent = ()=> {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

  return (
    <div>
      <SearchScreen API_KEY={API_KEY}/>
      <div><img src="img/up.png" alt="up" className='up-btn' onClick={upEvent} /></div>
    </div>
  );
};

export default App

