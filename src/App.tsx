import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardAdmin } from './pages/DashboardAdmin';
import './index.css';
import { DashboardFuncionario } from './pages/DashboardFuncionario';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
  
      <Header />

          <div className="container mx-auto px-4 py-4">
        <DashboardAdmin/>
        <DashboardFuncionario/>
      </div>
      <Footer />
    </div>
  );
}

export default App;