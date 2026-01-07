import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardAdmin } from './pages/DashboardAdmin';
import './index.css';
import { DashboardFuncionario } from './pages/DashboardFuncionario';

function App() {
  return (
    <div className="">
  
      <Header />

     
      <main className="flex-grow container mx-auto px-4 py-8">
        <DashboardFuncionario/>


      </main>

    
      <Footer />
    </div>
  );
}

export default App;