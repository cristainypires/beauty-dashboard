import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginBypass() {
  const router = useRouter();

  useEffect(() => {
    // No Pages Router, esperamos o roteador estar pronto para ler a URL
    if (!router.isReady) return;

    const { token, role } = router.query;

    if (token && role) {
      // Salva os dados
      localStorage.setItem('token', token as string);
      localStorage.setItem('user_role', role as string);
      
      console.log("Sessão sincronizada! Redirecionando...");

      // Redireciona para os seus arquivos que já existem na pasta pages
      if (role === 'admin') {
        router.push('/DashboardAdmin');
      } else if (role === 'funcionario' || role === 'recepcionista') {
        router.push('/DashboardFuncionario');
      } else if (role === 'profissional') {
        router.push('/DashboardProfissional');
      }
    } else if (router.isReady && !token) {
       // Se carregar e não tiver token, volta pro login
       window.location.href = "https://maddietavares.cv/login";
    }
  }, [router.isReady, router.query]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p>Sincronizando sessão...</p>
      </div>
    </div>
  );
}