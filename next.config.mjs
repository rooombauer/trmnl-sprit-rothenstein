/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statischer Export: das fertige Portfolio liegt nach `npm run build` in /out
  // und kann überall gehostet werden (Vercel, Netlify, GitHub Pages, eigener Server).
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
