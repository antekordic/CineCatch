export default {
  '/api': {
    target: 'http://localhost:4201',
    secure: false,
    logLevel: 'debug', // nx serve must must be called with --verbose for this to have an effect
    changeOrigin: true,
    pathRewrite: {
      '': '',
    },
  },
};
