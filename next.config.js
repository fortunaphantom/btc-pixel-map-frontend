/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ipfscdn.io",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "gateway.ipfs.io",
      },
      {
        protocol: "https",
        hostname: "ipfs.filebase.io",
      },
    ],
  },
  rewrites: () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/:path*", // Proxy to Backend
    },
  ],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },
};

module.exports = nextConfig;
