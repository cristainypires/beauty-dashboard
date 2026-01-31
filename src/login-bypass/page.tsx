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
      // Guarda os dados no LocalStorage do Dashboard
      localStorage.setItem('token', token)
      localStorage.setItem('user_role', role)
      
      console.log("Sessão sincronizada com sucesso!")

      // Redireciona para a página correta conforme a pasta
      if (role === 'admin') router.push('/admin')
      else if (role === 'funcionario' || role === 'recepcionista') router.push('/recepcao')
      else if (role === 'profissional') router.push('/profissional')
    } else {
      // Se falhar, volta para o site principal
      window.location.href = "https://maddietavares.cv/login"
    }
  }, [searchParams, router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Sincronizando Sessão...</p>
      </div>
    </div>
  )
}

// O Next.js exige Suspense ao usar useSearchParams
export default function LoginBypassPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BypassLogic />
    </Suspense>
  )
}