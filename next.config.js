/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    env: {
        APP_NAME: process.env.APP_NAME,
        APP_URL: process.env.APP_URL,
        API_URL: process.env.API_URL,
        SOLDEF_URL: process.env.SOLDEF_URL,
        APP_ENV: process.env.APP_ENV,
        MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
        AUTH_BASE_URL: process.env.AUTH_BASE_URL,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images:{
      remotePatterns:[
        {
          protocol: 'https',
          hostname: 'admin.nape.ar',
          port: '',
          pathname: '/logo/*'
        }
      ]
    }
}

module.exports = nextConfig
