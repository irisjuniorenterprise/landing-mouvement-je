const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.js');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [35, 75],
  },
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['gsap', 'leaflet', 'react-leaflet'],
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));