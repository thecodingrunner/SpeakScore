/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
};

module.exports = withNextIntl(nextConfig);