const withTM = require('next-transpile-modules');

const transpileModules = ['rc-pagination', 'antd', '@ant-design/icons', 'rc-util', 'rc-picker'];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    return config;
  },
};

module.exports = withTM(transpileModules)(nextConfig);
