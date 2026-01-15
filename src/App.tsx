// 1. Importe o React explicitamente para acessar os tipos
import React from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardFuncionario } from './pages/DashboardFuncionario';
import { DashboardProfissional } from './pages/DashboardProfissional';
import './index.css';

// 2. Use React.ReactNode em vez de JSX.Element para os children
interface PrivateRouteProps {
  children: React.ReactNode; 
  allowedRole: string;
}

function PrivateRoute({ children, allowedRole }: PrivateRouteProps) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" />; // Ou para a sua página inicial
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/home-redirect" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute allowedRole="admin">
                  <DashboardAdmin />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/recepcao/*" 
              element={
                <PrivateRoute allowedRole="funcionario">
                  <DashboardFuncionario />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/profissional/*" 
              element={
                <PrivateRoute allowedRole="profissional">
                  <DashboardProfissional />
                </PrivateRoute>
              } 
            />

            <Route path="/home-redirect" element={<HomeRedirect />} />
            
            {/* Rota padrão (Login ou Site Oficial) */}
            <Route path="/" element={<div>Página de Login / Site Oficial</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

function HomeRedirect() {
  const role = localStorage.getItem('user_role');
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'funcionario') return <Navigate to="/recepcao" />;
  if (role === 'profissional') return <Navigate to="/profissional" />;
  return <Navigate to="/" />;
}

export default App;