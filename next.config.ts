import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Чистый HTML/CSS/JS в out/ для GitHub Pages — без Node-сервера.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
