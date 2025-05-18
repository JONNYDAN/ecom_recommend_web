/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ecom-api.apollo-app.online",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "ecom-api.apollo-app.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vunguyen-local.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;
