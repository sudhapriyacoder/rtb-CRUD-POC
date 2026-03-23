import React from 'react';
import './App.css';
import UserList from '../components/UserList';
import { Header } from '../components/Header';

function App() {
  return (
     <main>
    <Header />
    <div className="App">
    
      
       <UserList />
     
    </div>
    </main>
  );
}

export default App;
