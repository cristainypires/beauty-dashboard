import type { AppProps } from 'next/app'
import '@/styles/globals.css' // Verifique se o caminho do seu CSS global está correto

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}