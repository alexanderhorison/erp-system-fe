const path = require('path')

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: !process.env.NEXT_PUBLIC_ENABLE_PWA,
  cacheStartUrl: false // Jangan cache halaman utama
})

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  trailingSlash: true,
  reactStrictMode: false, // Set false if needed
  swcMinify: true,
  // Add a function to generate a unique build ID for each deployment
  generateBuildId: async () => {
    // Return a timestamp-based ID to ensure uniqueness across deployments
    return `build-v-1.0.0-${Date.now()}`
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
})
