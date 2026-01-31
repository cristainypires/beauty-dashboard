/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ISSO gera a pasta 'out'
  images: { unoptimized: true } // Necessário para exportação estática
};
export default nextConfig;