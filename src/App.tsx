import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardAdmin } from './pages/DashboardAdmin';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F7]">
  
      <Header />

     
      <main className="flex-1">
        <DashboardAdmin />
      </main>

    
      <Footer />
    </div>
  );
}

export default App;