/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
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
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.nape.ar",
        port: "",
        pathname: "/logo/*",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(png|jpe?g|gif|jp2|webp|avif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static", // or any other path where you want to store the assets
            },
          },
        ],
      },
      {
        test: /\.(node)$/i,
        loader: "file-loader",
        options: {
          outputPath: "static", // or any other path where you want to store the assets
        },
      },
    );

    return config;
  },
};

module.exports = nextConfig;
