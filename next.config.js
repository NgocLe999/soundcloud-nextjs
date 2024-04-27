/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http", // ở môi trường dev http// production https
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**", /// ** không quan tâm tới nhưng file phía sau nữa
      },
    ],
  },
};

module.exports = nextConfig;
