'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function BypassLogic() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const role = searchParams.get('role')

    if (token && role) {
      localStorage.setItem('token', token)
      localStorage.setItem('user_role', role)
      
      console.log("Sessão sincronizada! Redirecionando...");

      // Nomes exatos dos arquivos que estão na sua pasta src/pages
      if (role === 'admin') {
        window.location.href = '/DashboardAdmin';
      } else if (role === 'funcionario' || role === 'recepcionista') {
        window.location.href = '/DashboardFuncionario';
      } else if (role === 'profissional') {
        window.location.href = '/DashboardProfissional';
      }
    } else {
      window.location.href = "https://maddietavares.cv/login"
    }
  }, [searchParams])

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Sincronizando Sessão...</p>
      </div>
    </div>
  )
}

export default function LoginBypassPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BypassLogic />
    </Suspense>
  )
}