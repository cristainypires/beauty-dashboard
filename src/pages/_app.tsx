import type { AppProps } from 'next/app'
import '../index.css' // Importa o CSS que tem o Tailwind

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}